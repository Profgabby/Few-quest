/**
 * StoryVerse role capability contract (offline design and UI guards).
 * NOT an authentication or authorization mechanism.
 * Server-side checks and database RLS are required before enabling writes.
 */
export const STORYVERSE_ROLES=["guest","reader","guardian","teacher","school_admin","community_facilitator","creator","editor","platform_admin"] as const;
export type StoryVerseRole=typeof STORYVERSE_ROLES[number];
export const STORYVERSE_CAPABILITIES=["browse_published","read_published","manage_own_progress","manage_guarded_readers","assign_school_stories","review_school_progress","manage_school_memberships","manage_community_groups","draft_stories","review_manuscripts","publish_approved","manage_platform"] as const;
export type StoryVerseCapability=typeof STORYVERSE_CAPABILITIES[number];
const capabilities:Record<StoryVerseRole,readonly StoryVerseCapability[]>={
 guest:["browse_published","read_published"],
 reader:["browse_published","read_published","manage_own_progress"],
 guardian:["browse_published","read_published","manage_own_progress","manage_guarded_readers"],
 teacher:["browse_published","read_published","manage_own_progress","assign_school_stories","review_school_progress"],
 school_admin:["browse_published","read_published","manage_own_progress","assign_school_stories","review_school_progress","manage_school_memberships"],
 community_facilitator:["browse_published","read_published","manage_own_progress","manage_community_groups"],
 creator:["browse_published","read_published","manage_own_progress","draft_stories"],
 editor:["browse_published","read_published","manage_own_progress","review_manuscripts"],
 platform_admin:[...STORYVERSE_CAPABILITIES]
};
export function canPreviewCapability(role:StoryVerseRole,capability:StoryVerseCapability){return capabilities[role].includes(capability);}
export function capabilityMatrix(){return STORYVERSE_ROLES.map(role=>({role,capabilities:[...capabilities[role]]}));}
export function validateRoleMatrix(){
 return STORYVERSE_ROLES.every(role=>capabilities[role].every(c=>STORYVERSE_CAPABILITIES.includes(c))) &&
 !canPreviewCapability("guest","manage_school_memberships") &&
 !canPreviewCapability("reader","review_school_progress") &&
 !canPreviewCapability("teacher","manage_guarded_readers") &&
 !canPreviewCapability("creator","publish_approved") &&
 canPreviewCapability("school_admin","manage_school_memberships");
}
