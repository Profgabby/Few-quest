import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const roles = ["teacher", "competitor_manager"] as const;
const languages = ["en", "ha", "yo", "ig", "fr", "ar"] as const;
const STEP_TIMEOUT_MS = 8000;

async function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(label + "_TIMEOUT")), STEP_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function POST(req: Request) {
  try {
    const origin = new URL(req.url).origin;
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const fullName = String(body.fullName || "").trim();
    const phone = String(body.phone || "").trim();
    const role = String(body.role || "");
    const preferredLanguage = String(body.preferredLanguage || "en");
    const locale = languages.includes(String(body.locale || "en") as any) ? String(body.locale || "en") : "en";

    if (!email || !fullName || !roles.includes(role as any) || !languages.includes(preferredLanguage as any)) {
      return NextResponse.json({ error: "INVALID_INPUT", message: "Please complete the required team member fields." }, { status: 400 });
    }

    const s = await createClient();
    const auth = await withTimeout(s.auth.getUser(), "AUTH");
    const user = auth.data.user;
    if (!user) return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });

    const membershipResult = await withTimeout(
      s.from("fewq_school_memberships").select("school_id,role,fewq_schools(status)").eq("user_id", user.id).eq("active", true),
      "SCHOOL_LOOKUP"
    );
    if (membershipResult.error) throw membershipResult.error;

    const admins = (membershipResult.data || []).filter((m: any) => m.role === "school_admin" && m.fewq_schools?.status === "active");
    if (admins.length !== 1) {
      return NextResponse.json(
        { error: "ACCESS_DENIED", message: admins.length > 1 ? "Select one active school before managing its team." : "An active school administrator account is required." },
        { status: 403 }
      );
    }
    const adminMembership: any = admins[0];
    const a = createAdminClient();

    // Avoid listing the entire Auth directory. createUser gives a deterministic duplicate-user error.
    let target: any = null;
    let created = false;
    const made = await withTimeout(
      a.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: fullName, phone, preferred_language: preferredLanguage },
      }),
      "ACCOUNT_CREATE"
    );

    if (made.data.user) {
      target = made.data.user;
      created = true;
    } else {
      const msg = (made.error?.message || "").toLowerCase();
      const duplicate = msg.includes("already") || msg.includes("registered") || msg.includes("exists");
      if (!duplicate) {
        return NextResponse.json({ error: "ACCOUNT_CREATE_FAILED", message: made.error?.message || "Could not create staff account." }, { status: 400 });
      }

      return NextResponse.json(
        { error: "ACCOUNT_EXISTS", message: "An account already uses this email. If this person is already on this school team, manage their access from the team list. Otherwise use a different email." },
        { status: 409 }
      );
    }

    const rollbackNewUser = async () => {
      if (created && target?.id) {
        try { await withTimeout(a.auth.admin.deleteUser(target.id), "ROLLBACK"); } catch {}
      }
    };

    const other = await withTimeout(
      a.from("fewq_school_memberships").select("id,school_id").eq("user_id", target.id).eq("active", true).neq("school_id", adminMembership.school_id).limit(1),
      "ASSIGNMENT_CHECK"
    );
    if (other.error) { await rollbackNewUser(); throw other.error; }
    if (other.data?.length) {
      await rollbackNewUser();
      return NextResponse.json({ error: "MEMBER_ALREADY_ASSIGNED", message: "This account is already assigned to another school." }, { status: 409 });
    }

    const profile = await withTimeout(
      a.from("fewq_profiles").upsert({ id: target.id, full_name: fullName, preferred_language: preferredLanguage }, { onConflict: "id" }),
      "PROFILE_SAVE"
    );
    if (profile.error) { await rollbackNewUser(); throw profile.error; }

    const existing = await withTimeout(
      a.from("fewq_school_memberships").select("id").eq("school_id", adminMembership.school_id).eq("user_id", target.id).limit(1).maybeSingle(),
      "MEMBERSHIP_LOOKUP"
    );
    if (existing.error) { await rollbackNewUser(); throw existing.error; }

    let membershipId = existing.data?.id;
    let membershipError: any = null;
    if (existing.data) {
      const updated = await withTimeout(
        a.from("fewq_school_memberships").update({ role, active: true, updated_at: new Date().toISOString() }).eq("id", existing.data.id),
        "MEMBERSHIP_UPDATE"
      );
      membershipError = updated.error;
    } else {
      const inserted = await withTimeout(
        a.from("fewq_school_memberships").insert({
          school_id: adminMembership.school_id,
          user_id: target.id,
          role,
          active: true,
          created_by: user.id,
        }).select("id").single(),
        "MEMBERSHIP_CREATE"
      );
      membershipError = inserted.error;
      membershipId = inserted.data?.id;
    }
    if (membershipError) { await rollbackNewUser(); throw membershipError; }

    // Membership creation is the critical operation. Link generation must not make it look like creation failed.
    let setupLink: string | null = null;
    let setupWarning: string | null = null;
    try {
      const link = await withTimeout(
        a.auth.admin.generateLink({
          type: "recovery",
          email,
          options: { redirectTo: origin + "/auth/callback?next=/" + locale + "/login" },
        }),
        "SETUP_LINK"
      );
      if (link.error) setupWarning = link.error.message;
      else setupLink = link.data.properties?.action_link || null;
    } catch {
      setupWarning = "The member was created, but the password setup link could not be generated yet.";
    }

    // Audit failure is reported as a warning, not an endless request.
    let auditWarning: string | null = null;
    try {
      const audit = await withTimeout(
        a.from("fewq_audit_events").insert({
          event_type: created ? "MEMBER_ADDED" : "MEMBER_ROLE_CHANGED",
          actor_user_id: user.id,
          actor_role: "school_admin",
          school_id: adminMembership.school_id,
          entity_type: "school_membership",
          entity_id: membershipId,
          metadata: { email, role, preferred_language: preferredLanguage, phone_present: Boolean(phone) },
        }),
        "AUDIT"
      );
      if (audit.error) auditWarning = audit.error.message;
    } catch {
      auditWarning = "The member was created, but the audit event could not be written.";
    }

    return NextResponse.json({
      ok: true,
      email,
      role,
      setupRequired: true,
      setupLink,
      warning: [setupWarning, auditWarning].filter(Boolean).join(" "),
    });
  } catch (error: any) {
    const message = String(error?.message || "");
    const timedOut = message.endsWith("_TIMEOUT");
    console.error("FEW Quest team member creation failed", { timedOut, message });
    return NextResponse.json(
      { error: timedOut ? "REQUEST_TIMEOUT" : "SERVER_ERROR", message: timedOut ? "A server step took too long. No endless wait: please try again." : "Could not add the team member. Please try again." },
      { status: timedOut ? 504 : 500 }
    );
  }
}
