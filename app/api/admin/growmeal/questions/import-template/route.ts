import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { createClient } from "@/lib/supabase/server";
import { growMealCompetitionCategories, growMealGardenDomains } from "@/lib/competition/growmeal";

export const runtime = "nodejs";

export async function GET() {
  const s = await createClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { data: role } = await s.from("fewq_platform_roles").select("role").eq("user_id", user.id).eq("active", true).in("role", ["platform_admin","content_reviewer"]).maybeSingle();
  if (!role) return NextResponse.json({ error: "Access denied" }, { status: 403 });

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("GrowMeal Questions");
  const headers = ["competition_category","class_level","garden_code","garden_domain","question_text","option_a","option_b","option_c","option_d","correct_option","explanation","difficulty","source_reference"];
  ws.addRow(headers);
  ws.addRow(["GM-NUR","Nursery 1","N01","Alphabet Garden","Which letter begins the word plant?","P","B","T","S","A","Plant begins with P.","foundation","GM-NUR-source"]);

  const ref = wb.addWorksheet("Valid Values");
  ref.addRow(["Category","Name","Valid classes","Valid garden codes"]);
  for (const c of growMealCompetitionCategories) ref.addRow([c.code,c.name,c.classes.join(" | "),c.gardenCodes.join(" | ")]);
  ref.addRow([]);
  ref.addRow(["Difficulty","foundation | standard | advanced"]);
  ref.addRow(["Correct option","A | B | C | D"]);
  ref.addRow(["Import status","Every imported question enters as draft"]);
  ref.addRow([]);
  ref.addRow(["Garden code","Canonical garden domain"]);
  Object.entries(growMealGardenDomains).forEach(([code,name]) => ref.addRow([code,name]));

  ws.getRow(1).font = { bold: true };
  ref.getRow(1).font = { bold: true };
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ref.views = [{ state: "frozen", ySplit: 1 }];
  ws.columns = headers.map(h => ({ header: h, key: h, width: h === "question_text" || h === "explanation" ? 42 : 22 }));
  ref.columns = [{width:18},{width:24},{width:45},{width:55}];

  const buffer = await wb.xlsx.writeBuffer();
  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": 'attachment; filename="growmeal-question-import-template.xlsx"',
      "cache-control": "no-store",
    },
  });
}
