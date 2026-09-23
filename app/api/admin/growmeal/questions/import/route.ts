import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { Readable } from "node:stream";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { growMealCompetitionCategories } from "@/lib/competition/growmeal";

export const runtime = "nodejs";
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_ROWS = 2000;
const MAX_CELL_CHARS = 4000;
const headers = ["competition_category","class_level","garden_code","garden_domain","question_text","option_a","option_b","option_c","option_d","correct_option","explanation","difficulty","source_reference"] as const;
type Row = Record<(typeof headers)[number], string>;

async function guard() {
  const s = await createClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user) return null;
  const { data } = await s.from("fewq_platform_roles").select("role").eq("user_id", user.id).eq("active", true).in("role", ["platform_admin","content_reviewer"]).maybeSingle();
  return data ? user : null;
}
function clean(v: unknown) { return String(v ?? "").trim(); }
function normalizedQuestion(v: string) { return v.trim().replace(/\\s+/g, " ").toLowerCase(); }
function validate(r: Row, line: number) {
  const errors: string[] = [];
  const cat = growMealCompetitionCategories.find(c => c.code === r.competition_category);
  if (!cat) errors.push("invalid competition_category");
  if (cat && !cat.classes.includes(r.class_level)) errors.push("class_level does not belong to category");
  if (cat && !cat.gardenCodes.includes(r.garden_code)) errors.push("garden_code does not belong to category");
  if (!r.question_text) errors.push("question_text is required");
  if (r.question_text.length > MAX_CELL_CHARS) errors.push("question_text is too long");
  if (!r.garden_domain) errors.push("garden_domain is required");
  for (const k of ["option_a","option_b","option_c","option_d"] as const) if (!r[k]) errors.push(k+" is required");
  if (!["A","B","C","D"].includes(r.correct_option.toUpperCase())) errors.push("correct_option must be A, B, C or D");
  if (r.difficulty && !["foundation","standard","advanced"].includes(r.difficulty.toLowerCase())) errors.push("invalid difficulty");
  return errors.map(e => `Row ${line}: ${e}`);
}
async function rowsFromFile(file: File): Promise<Row[]> {
  const ext = file.name.toLowerCase();
  const wb = new ExcelJS.Workbook();
  const buf = Buffer.from(await file.arrayBuffer());
  if (ext.endsWith(".csv")) await wb.csv.read(Readable.from([buf]));
  else if (ext.endsWith(".xlsx")) await wb.xlsx.load(buf as any);
  else throw new Error("Use a .csv or .xlsx file.");
  const ws = wb.worksheets[0];
  if (!ws) throw new Error("The workbook has no worksheet.");
  const first = ws.getRow(1).values as unknown[];
  const map = new Map<string, number>();
  first.forEach((v, i) => { const h = clean(v).toLowerCase(); if (h) map.set(h, i); });
  const missing = headers.filter(h => !map.has(h));
  if (missing.length) throw new Error("Missing columns: "+missing.join(", "));
  const rows: Row[] = [];
  for (let n=2;n<=ws.rowCount;n++) {
    const row = ws.getRow(n);
    if (!clean(row.getCell(map.get("question_text")!).value)) continue;
    const out = {} as Row;
    for (const h of headers) out[h] = clean(row.getCell(map.get(h)!).value);
    rows.push(out);
  }
  return rows;
}
export async function POST(req: Request) {
  const user = await guard();
  if (!user) return NextResponse.json({error:"Access denied"},{status:403});
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({error:"Choose a CSV or Excel file."},{status:400});
    if (file.size > MAX_BYTES) return NextResponse.json({error:"File is larger than 5 MB."},{status:413});
    const rows = await rowsFromFile(file);
    if (!rows.length) return NextResponse.json({error:"No question rows were found."},{status:400});
    if (rows.length > MAX_ROWS) return NextResponse.json({error:`Import is limited to ${MAX_ROWS} questions per file.`},{status:400});
    const errors = rows.flatMap((r,i)=>validate(r,i+2));
    const seen = new Map<string, number>();
    rows.forEach((r,i)=>{
      const key = [r.competition_category,r.class_level,r.garden_code,normalizedQuestion(r.question_text)].join("|");
      const prior = seen.get(key);
      if (prior) errors.push(`Row ${i+2}: duplicate question in file (matches row ${prior})`);
      else seen.set(key,i+2);
    });
    if (errors.length) return NextResponse.json({error:"Import validation failed.",errors:errors.slice(0,100),errorCount:errors.length},{status:400});

    const admin = createAdminClient();
    const { data: existingRows, error: existingError } = await admin.from("question_bank").select("competition_category,class_level,garden_code,question_text").eq("quest_family","GrowMeal");
    if (existingError) throw new Error(existingError.message);
    const existingKeys = new Set((existingRows || []).map((q:any)=>[q.competition_category,q.class_level||"",q.garden_code||"",normalizedQuestion(q.question_text||"")].join("|")));
    const databaseDuplicates = rows.flatMap((r,i)=> existingKeys.has([r.competition_category,r.class_level,r.garden_code,normalizedQuestion(r.question_text)].join("|")) ? [`Row ${i+2}: question already exists in the GrowMeal bank`] : []);
    if (databaseDuplicates.length) return NextResponse.json({error:"Import contains questions already in the bank.",errors:databaseDuplicates.slice(0,100),errorCount:databaseDuplicates.length},{status:409});
    const payloads = [];
    for (const r of rows) {
      const {data:code,error} = await admin.rpc("fewq_next_growmeal_question_code");
      if (error) throw new Error(error.message);
      payloads.push({
        question_code: code, quest_family:"GrowMeal", competition_category:r.competition_category,
        class_level:r.class_level, garden_code:r.garden_code, garden_domain:r.garden_domain||null,
        question_text:r.question_text, option_a:r.option_a, option_b:r.option_b, option_c:r.option_c, option_d:r.option_d,
        correct_option:r.correct_option.toUpperCase(), explanation:r.explanation||null,
        difficulty:(r.difficulty||"standard").toLowerCase(), lifecycle_status:"draft",
        source_reference:r.source_reference||null, created_by:user.id
      });
    }
    const {error} = await admin.from("question_bank").insert(payloads);
    if (error) throw new Error(error.message);
    const byCategory = payloads.reduce<Record<string, number>>((acc, q) => {
      acc[q.competition_category] = (acc[q.competition_category] || 0) + 1;
      return acc;
    }, {});
    return NextResponse.json({ok:true,imported:payloads.length,byCategory});
  } catch (e) {
    const message = e instanceof Error ? e.message : "Import failed.";
    console.error("GrowMeal bulk question import failed:", message);
    return NextResponse.json({error:message},{status:500});
  }
}
