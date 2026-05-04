// utils/moodKnowledge.ts

export type Effect = {
  stress?: number;
  energy?: number;
  tag?: string;
};

/* ----------------------------------
 * Detail mood effects
 * ---------------------------------- */
export const DETAIL_MOOD_EFFECTS: Record<string, Effect> = {
  /* -----------------------------
   * Positive / High energy
   * ----------------------------- */
  "Hào hứng": { energy: 2 },
  "Vui vẻ": { energy: 1 },
  "Phấn khởi": { energy: 2 },
  "Biết ơn": { energy: 1, tag: "positive_reflection" },
  "Tự hào": { energy: 1 },
  "Thoải mái": { stress: -1 },
  "Tràn đầy năng lượng": { energy: 3 },
  "Lạc quan": { energy: 1 },
  "Yêu đời": { energy: 2 },
  "Được truyền cảm hứng": { energy: 2 },

  /* -----------------------------
   * Calm / Peaceful
   * ----------------------------- */
  "Thư giãn": { stress: -2 },
  "Bình yên": { stress: -3 },
  "Cân bằng": { stress: -1 },
  "Nhẹ nhõm": { stress: -2 },
  "An toàn": { stress: -1 },
  "Hài lòng": { stress: -1 },
  "Tĩnh lặng": { stress: -2 },
  "Dễ chịu": { stress: -1 },
  "Không áp lực": { stress: -3 },
  "Thả lỏng": { stress: -2 },

  /* -----------------------------
   * Neutral / Low signal
   * ----------------------------- */
  "Bình thường": {},
  "Ổn định": {},
  "Không rõ ràng": {},
  "Không có gì đặc biệt": {},
  "Tạm ổn": {},
  "Trung lập": {},
  "Thiếu cảm xúc": { energy: -1, tag: "emotional_flat" },
  "Lửng lơ": { energy: -1 },

  /* -----------------------------
   * Sad / Fatigue
   * ----------------------------- */
  "Buồn bã": { energy: -1, tag: "sadness" },
  "Cô đơn": { stress: 1, energy: -1, tag: "loneliness" },
  "Tổn thương": { stress: 2, tag: "emotional_pain" },
  "Thất vọng": { stress: 1, energy: -1, tag: "sadness" },

  "Mệt mỏi": { energy: -2, tag: "fatigue" },
  "Chán nản": { energy: -2, tag: "fatigue" },
  "Mất động lực": { energy: -2, tag: "fatigue" },
  "Đuối năng lượng": { energy: -3, tag: "fatigue" },
  "Trống rỗng": { energy: -1, tag: "emotional_flat" },
  "Không muốn làm gì": { energy: -3, tag: "apathy" },

  /* -----------------------------
   * Severe fatigue / Burnout
   * ----------------------------- */
  "Kiệt sức": { energy: -4, stress: 2, tag: "burnout" },
  "Burnout": { energy: -4, stress: 3, tag: "burnout" },

  /* -----------------------------
   * Anxiety / Stress
   * ----------------------------- */
  "Lo lắng": { stress: 2, tag: "stress" },
  "Lo sợ": { stress: 2, tag: "anxiety" },
  "Bất an": { stress: 2, tag: "anxiety" },
  "Căng thẳng": { stress: 2, tag: "stress" },
  "Áp lực": { stress: 3, tag: "stress" },
  "Bồn chồn": { stress: 1 },
  "Hồi hộp": { stress: 1 },
  "Sợ hãi": { stress: 3, tag: "anxiety" },
  "Hoang mang": { stress: 2 },
  "Không kiểm soát được": { stress: 3, tag: "anxiety" },
};
