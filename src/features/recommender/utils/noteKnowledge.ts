// utils/noteKnowledge.ts

export type NoteEffect = {
  stress?: number;
  energy?: number;
  tag?: string;
};

export const NOTE_PATTERNS: {
  pattern: RegExp;
  effect: NoteEffect;
}[] = [
  /* -----------------------------
   * Sleep / Fatigue
   * ----------------------------- */
  {
    pattern: /mệt|buồn ngủ|thiếu ngủ|ngủ ít|khó ngủ|mất ngủ/i,
    effect: { energy: -2, tag: "sleep_deprivation" },
  },
  {
    pattern: /kiệt sức|đuối quá|quá mệt|không còn sức/i,
    effect: { energy: -3, stress: 1, tag: "fatigue" },
  },
  {
    pattern: /burnout|cháy năng lượng|quá tải/i,
    effect: { energy: -4, stress: 2, tag: "burnout" },
  },

  /* -----------------------------
   * Stress / Pressure
   * ----------------------------- */
  {
    pattern: /áp lực|stress|căng thẳng|nghẹt thở/i,
    effect: { stress: 2, tag: "stress" },
  },
  {
    pattern: /deadline|trễ hạn|gấp|nước đến chân/i,
    effect: { stress: 3, tag: "deadline" },
  },
  {
    pattern: /thi cử|bài kiểm tra|phỏng vấn/i,
    effect: { stress: 3, tag: "performance_pressure" },
  },

  /* -----------------------------
   * Emotion / Motivation
   * ----------------------------- */
  {
    pattern: /chán|mất động lực|không muốn làm|lười/i,
    effect: { energy: -2, tag: "apathy" },
  },
  {
    pattern: /buồn|tủi thân|cô đơn/i,
    effect: { energy: -1, stress: 1, tag: "sadness" },
  },
  {
    pattern: /lo lắng|bất an|sợ/i,
    effect: { stress: 2, tag: "anxiety" },
  },

  /* -----------------------------
   * Cognitive overload
   * ----------------------------- */
  {
    pattern: /đầu óc rối|khó tập trung|mất tập trung/i,
    effect: { stress: 1, energy: -1, tag: "mental_overload" },
  },
  {
    pattern: /quá nhiều việc|không kịp|dồn việc/i,
    effect: { stress: 2, tag: "workload" },
  },

  /* -----------------------------
   * Recovery / Relief
   * ----------------------------- */
  {
    pattern: /nghỉ ngơi|thư giãn|ngủ bù|nghỉ chút/i,
    effect: { stress: -2, energy: 1, tag: "recovery" },
  },
  {
    pattern: /thiền|hít thở|yoga/i,
    effect: { stress: -2, tag: "mindfulness" },
  },
  {
    pattern: /đi bộ|ra ngoài|hít khí trời/i,
    effect: { stress: -1, energy: 1, tag: "light_movement" },
  },

  /* -----------------------------
   * Positive reflection
   * ----------------------------- */
  {
    pattern: /ổn hơn|nhẹ nhõm|thoải mái|dễ chịu/i,
    effect: { stress: -1 },
  },
  {
    pattern: /vui|hạnh phúc|hào hứng|có động lực/i,
    effect: { energy: 2, tag: "positive_mood" },
  },
  {
    pattern: /biết ơn|hài lòng/i,
    effect: { stress: -1, energy: 1, tag: "positive_reflection" },
  },
];
