// utils/activityEffects.ts

import { Effect } from "./moodKnowledge";

/**
 * Quy ước nhanh:
 *  - stress: + → tăng áp lực | - → giảm áp lực
 *  - energy: + → hồi năng lượng | - → hao năng lượng
 *  - tag: nguyên nhân chính để recommender giải thích
 */

export const ACTIVITY_EFFECTS: Record<string, Effect> = {
  /* -----------------------------
   * Work / Study
   * ----------------------------- */
  work: { stress: 1, energy: -1, tag: "workload" },
  study: { stress: 1, energy: -1, tag: "study_pressure" },
  coding: { stress: 1, energy: -1, tag: "mental_load" },
  meeting: { stress: 1, energy: -1, tag: "meeting_overload" },
  presentation: { stress: 2, energy: -1, tag: "performance_pressure" },
  exam: { stress: 3, energy: -2, tag: "exam_stress" },
  deadline: { stress: 3, tag: "deadline" },

  /* -----------------------------
   * Digital / Screen
   * ----------------------------- */
  social: { energy: 1, tag: "social_connection" },
  scrolling: { stress: 1, energy: -2, tag: "screen_fatigue" },
  game: { energy: 1, tag: "entertainment" },
  movie: { stress: -1, energy: 0, tag: "relaxation" },

  /* -----------------------------
   * Body / Health
   * ----------------------------- */
  exercise: { stress: -1, energy: 2, tag: "physical_activity" },
  walk: { stress: -1, energy: 1, tag: "light_movement" },
  stretch: { stress: -1, energy: 1, tag: "body_relief" },

  sleep: { energy: 2, tag: "sleep" },
  nap: { energy: 1, tag: "sleep_deprivation" },
  rest: { stress: -1, energy: 1, tag: "recovery" },

  /* -----------------------------
   * Mind / Relax
   * ----------------------------- */
  music: { stress: -1, energy: 0, tag: "emotional_relief" },
  meditation: { stress: -2, energy: 1, tag: "mindfulness" },

  /* -----------------------------
   * Social / Life
   * ----------------------------- */
  party: { energy: 2, stress: 0, tag: "social_energy" },
  travel: { stress: -2, energy: 2, tag: "refreshment" },
  cooking: { stress: -1, energy: 1, tag: "daily_life_balance" },
};
