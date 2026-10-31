export type StoryVerseLevel = 1 | 2 | 3;
export type ProfileKind = 'individual' | 'family_child' | 'school_learner';
export type AccountProfile = { id: string; ownerUserId: string; displayName: string; kind: ProfileKind; preferredLevel: StoryVerseLevel; preferredLocale: string };
/** Account ownership and family/school membership must be validated on the server. */
export type StoryProgressRecord = { profileId: string; storySlug: string; sceneIndex: number; completedAt: string | null };
