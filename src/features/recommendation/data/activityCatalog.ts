import { RecommendationAction } from "../types/recommendation";

export const ACTIVITY_CATALOG: RecommendationAction[] = [
  {
    id: "deep_rest",
    title: "Nghỉ sâu không màn hình",
    description: "Não và cơ thể cần được hồi phục thực sự",
    category: "body",
    duration: { min: 30, max: 45 },
    exp: 40,
    tags: ["recovery", "burnout", "fatigue"],
    stressRelief: 5,
    energyBoost: 4,
    suitableFor: {
      lowEnergy: true,
      highStress: true,
    },
  },

  {
    id: "power_nap",
    title: "Chợp mắt 15–20 phút",
    description: "Phục hồi năng lượng nhanh",
    category: "body",
    duration: { min: 15, max: 20 },
    exp: 25,
    tags: ["fatigue", "sleep"],
    stressRelief: 2,
    energyBoost: 5,
    suitableFor: {
      lowEnergy: true,
    },
  },

  {
    id: "grounding",
    title: "5–4–3–2–1 Grounding",
    description: "Kéo tâm trí về hiện tại",
    category: "mind",
    duration: { min: 5, max: 7 },
    exp: 20,
    tags: ["anxiety", "stress"],
    stressRelief: 5,
    energyBoost: 1,
    suitableFor: {
      highStress: true,
    },
  },

  {
    id: "breathing",
    title: "Hít thở sâu",
    description: "Ổn định hệ thần kinh",
    category: "quick",
    duration: { min: 3, max: 3 },
    exp: 10,
    tags: ["stress"],
    stressRelief: 4,
    energyBoost: 1,
    suitableFor: {
      highStress: true,
    },
  },

  {
    id: "walk",
    title: "Đi bộ nhẹ",
    description: "Giải phóng căng thẳng",
    category: "body",
    duration: { min: 10, max: 20 },
    exp: 20,
    tags: ["movement", "stress"],
    stressRelief: 3,
    energyBoost: 3,
    suitableFor: {
      lowEnergy: true,
      highStress: true,
    },
  },

  {
    id: "journal_reflection",
    title: "Viết nhật ký cảm xúc",
    description: "Giải tỏa suy nghĩ tiêu cực",
    category: "mind",
    duration: { min: 10, max: 15 },
    exp: 20,
    tags: ["sad", "anxiety"],
    stressRelief: 4,
    energyBoost: 1,
    suitableFor: {
      highStress: true,
    },
  },

  {
    id: "music_relax",
    title: "Nghe nhạc thư giãn",
    description: "Cải thiện tâm trạng",
    category: "mind",
    duration: { min: 10, max: 20 },
    exp: 15,
    tags: ["sad"],
    stressRelief: 3,
    energyBoost: 2,
    suitableFor: {
      lowEnergy: true,
    },
  },

  {
    id: "gratitude",
    title: "Viết 3 điều biết ơn",
    description: "Tăng cảm xúc tích cực",
    category: "mind",
    duration: { min: 5, max: 10 },
    exp: 15,
    tags: ["happy", "positive"],
    stressRelief: 2,
    energyBoost: 2,
    suitableFor: {},
  },

  {
    id: "celebrate",
    title: "Tự thưởng cho bản thân",
    description: "Ghi nhận thành quả hôm nay",
    category: "quick",
    duration: { min: 5, max: 15 },
    exp: 15,
    tags: ["happy"],
    stressRelief: 1,
    energyBoost: 3,
    suitableFor: {},
  },

  {
    id: "exercise",
    title: "Tập thể dục nhẹ",
    description: "Tận dụng năng lượng tích cực",
    category: "body",
    duration: { min: 20, max: 30 },
    exp: 30,
    tags: ["movement", "happy"],
    stressRelief: 2,
    energyBoost: 5,
    suitableFor: {},
  },

  {
    id: "stretching",
    title: "Giãn cơ toàn thân",
    description: "Giảm áp lực cơ thể",
    category: "body",
    duration: { min: 5, max: 10 },
    exp: 15,
    tags: ["stress"],
    stressRelief: 4,
    energyBoost: 2,
    suitableFor: {
      highStress: true,
    },
  },
];