/**
 * StoryVerse SV-M2 entitlement contract.
 * Pure definitions only: no database, Stripe, UI or reader behavior changes.
 * Server authorization MUST verify current entitlements independently.
 */
export type StoryVersePlan = "free" | "plus" | "family" | "school";
export type StoryVerseRole = "reader" | "guardian" | "teacher" | "school_admin" | "editor" | "publisher_admin";
export type StoryVerseCapability =
  | "read_free" | "read_premium" | "comprehension_basic" | "comprehension_advanced"
  | "offline_selected" | "offline_school_pack" | "listen_premium"
  | "family_profiles" | "guardian_reports" | "classroom_assignments"
  | "teacher_reports" | "reading_league_events" | "private_drafts";

export type StoryVerseEntitlement = {
  plan: StoryVersePlan;
  accountId: string;
  status: "active" | "trialing" | "past_due" | "canceled" | "expired";
  capabilities: readonly StoryVerseCapability[];
  issuedAt: string;
  expiresAt: string | null;
  source: "server" | "offline_snapshot";
};

export const PLAN_CAPABILITIES: Readonly<Record<StoryVersePlan, readonly StoryVerseCapability[]>> = {
  free: ["read_free", "comprehension_basic", "private_drafts"],
  plus: ["read_free", "read_premium", "comprehension_basic", "comprehension_advanced", "offline_selected", "listen_premium", "private_drafts"],
  family: ["read_free", "read_premium", "comprehension_basic", "comprehension_advanced", "offline_selected", "listen_premium", "private_drafts", "family_profiles", "guardian_reports"],
  school: ["read_free", "read_premium", "comprehension_basic", "comprehension_advanced", "offline_selected", "offline_school_pack", "classroom_assignments", "teacher_reports", "reading_league_events"]
} as const;

/** Feature flags default OFF. Server runtime can opt in later after verification. */
export const STORYVERSE_FEATURE_FLAGS = {
  billing: false,
  premiumEntitlements: false,
  offlineDownloads: false,
  listen: false,
  learn: false,
  create: false,
  classroom: false,
  languages: false,
  readingLeague: false,
  marketplace: false,
  publicSubmissions: false
} as const;

export function planIncludes(plan: StoryVersePlan, capability: StoryVerseCapability): boolean {
  return PLAN_CAPABILITIES[plan].includes(capability);
}

/** Advisory only; never use this function alone to authorize protected content. */
export function isEntitlementCurrent(entitlement: StoryVerseEntitlement, now: Date): boolean {
  if (entitlement.status !== "active" && entitlement.status !== "trialing") return false;
  if (!entitlement.expiresAt) return entitlement.source === "server";
  const expiry = Date.parse(entitlement.expiresAt);
  return Number.isFinite(expiry) && expiry > now.getTime();
}
