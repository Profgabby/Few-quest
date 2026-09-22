"use client";
import { useState } from "react";

export function TeamInviteForm({ locale }: { locale: string }) {
  const [state, setState] = useState("");
  const [setupLink, setSetupLink] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);

    setBusy(true);
    setState("Creating team member…");
    setSetupLink(null);

    try {
      const response = await fetch("/api/school/team/invite", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: fd.get("fullName"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          role: fd.get("role"),
          preferredLanguage: fd.get("preferredLanguage"),
          locale,
        }),
        signal: controller.signal,
      });

      const raw = await response.text();
      let result: any = {};
      try { result = raw ? JSON.parse(raw) : {}; } catch {}

      if (!response.ok) {
        setState(result.message || result.error || "Could not add team member. Please try again.");
        return;
      }

      setState(result.warning
        ? "Team member added. " + result.warning
        : "Team member added successfully. The staff member can now set their password.");
      setSetupLink(result.setupLink || null);
      form.reset();
      window.setTimeout(() => window.location.reload(), 3000);
    } catch (error: any) {
      setState(
        error?.name === "AbortError"
          ? "The request took too long and was stopped. Please try again."
          : "Could not reach the team-member service. Please refresh the page and try once more."
      );
    } finally {
      window.clearTimeout(timeout);
      setBusy(false);
    }
  }

  return <form className="team-form" onSubmit={submit}>
    <label>Full name<input name="fullName" required minLength={2} disabled={busy} /></label>
    <label>Email<input name="email" type="email" required disabled={busy} /></label>
    <label>Phone <span>(optional)</span><input name="phone" type="tel" disabled={busy} /></label>
    <label>Role<select name="role" defaultValue="teacher" disabled={busy}><option value="teacher">Teacher</option><option value="competitor_manager">Competitor manager</option></select></label>
    <label>Preferred language<select name="preferredLanguage" defaultValue="en" disabled={busy}><option value="en">English</option><option value="ha">Hausa</option><option value="yo">Yorùbá</option><option value="ig">Igbo</option><option value="fr">Français</option><option value="ar">العربية</option></select></label>
    <button className="btn" type="submit" disabled={busy}>{busy ? "Creating member…" : "Add team member"}</button>
    {state && <p role="status" aria-live="polite">{state}</p>}
    {setupLink && <p><a href={setupLink} target="_blank" rel="noreferrer">Open secure password setup link</a></p>}
  </form>;
}
