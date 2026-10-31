/** Shared rules only; server must independently verify qualifying events. */
export const STORYVERSE_REWARDS = { story_completed: 20, challenge_correct: 5, alternate_ending: 10, language_story_completed: 15, mission_approved: 25, story_created: 30 } as const;
export type RewardKind = keyof typeof STORYVERSE_REWARDS;
export type RewardEvent = { kind: RewardKind; sourceId: string; language?: string };
export function rewardKey(event: RewardEvent): string {
  if (!event.sourceId || !/^[a-zA-Z0-9:_-]{1,120}$/.test(event.sourceId)) throw new Error('Invalid reward source');
  return [event.kind, event.sourceId, event.language ?? ''].join(':');
}
export function rewardPoints(event: RewardEvent): number { return STORYVERSE_REWARDS[event.kind]; }
export const BADGE_RULES = [
  { code: 'first-story', label: 'First Story', minStories: 1 },
  { code: 'story-explorer', label: 'Story Explorer', minStories: 3 },
  { code: 'curious-explorer', label: 'Curious Explorer', minChallenges: 3 },
] as const;
