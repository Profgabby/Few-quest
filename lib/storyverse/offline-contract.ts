import type {StoryVerseCapability, StoryVerseEntitlement} from "./entitlements";
import {isEntitlementCurrent} from "./entitlements";

/**
 * Offline pilot domain model, not wired to the current reader.
 * No unpublished manuscript is implicitly eligible for downloads.
 */
export type OfflineBookManifest = {
  schemaVersion: 1;
  bookId: string;
  edition: string;
  title: string;
  publicationApproved: true;
  offlineLicensed: true;
  sceneCount: 7;
  questionCount: 14;
  assets: readonly {url: string; sha256: string; bytes: number}[];
};

export type OfflineProgressEvent = {
  eventId: string;
  bookId: string;
  edition: string;
  profileId: string;
  type: "scene_opened" | "question_answered" | "story_completed";
  sceneIndex: number;
  questionIndex?: number;
  answerIndex?: number;
  createdAt: string;
};

/** Check local eligibility for a future verified, signed offline entitlement snapshot. */
export function canOfferOfflineDownload(
  manifest: OfflineBookManifest,
  entitlement: StoryVerseEntitlement,
  now: Date
): boolean {
  const capability: StoryVerseCapability = entitlement.plan === "school" ? "offline_school_pack" : "offline_selected";
  return manifest.publicationApproved === true &&
    manifest.offlineLicensed === true &&
    isEntitlementCurrent(entitlement, now) &&
    entitlement.capabilities.includes(capability);
}

/** Deterministic idempotency helper for queued offline event reconciliation. */
export function deduplicateProgressEvents(events: readonly OfflineProgressEvent[]): OfflineProgressEvent[] {
  const seen = new Set<string>();
  return events.filter(event => {
    if (!event.eventId || seen.has(event.eventId)) return false;
    seen.add(event.eventId);
    return true;
  });
}

/** The first offline fixture must be independently authored and explicitly approved. */
export const OFFLINE_PILOT_STATUS = {
  enabled: false,
  approvedFixtureAvailable: false,
  serviceWorkerInstalled: false,
  indexedDbStorageImplemented: false,
  synchronizationImplemented: false
} as const;
