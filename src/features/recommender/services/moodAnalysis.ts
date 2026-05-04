import { MoodLog } from "../types/mood";
import { DETAIL_MOOD_EFFECTS } from "../utils/moodKnowledge";
import { ACTIVITY_EFFECTS } from "../utils/activityEffects";
import { NOTE_PATTERNS } from "../utils/noteKnowledge";

/* -----------------------------
 * Types
 * ----------------------------- */
export interface ReasonTag {
  tag: string;
  weight: number;
}

export interface MoodInsight {
  tone: "positive" | "neutral" | "negative";
  stressLevel: "low" | "medium" | "high";
  energyLevel: "low" | "medium" | "high";
  reasonTags: ReasonTag[];
  summary: string;

  noteDominant: boolean;
  primaryNoteTags: string[];
}

/* -----------------------------
 * Main analyzer
 * ----------------------------- */
export function analyzeMood(
  log: MoodLog,
  history: MoodLog[] = []
): MoodInsight {
  const { moodId, detailMoods = [], activities = [], note = "" } = log;

  let stressScore = 0;
  let energyScore = 0;
  const tagMap = new Map<string, number>();
  const noteTags = new Set<string>();

  const addTag = (tag: string, weight = 1) => {
    tagMap.set(tag, (tagMap.get(tag) ?? 0) + weight);
  };

  /* -----------------------------
   * 1. Base mood
   * ----------------------------- */
  if (["sad", "anxious"].includes(moodId)) stressScore += 2;
  if (moodId === "happy") energyScore += 2;
  if (moodId === "peaceful") stressScore -= 2;

  /* -----------------------------
   * 2. Detail moods
   * ----------------------------- */
  for (const mood of detailMoods) {
    const effect = DETAIL_MOOD_EFFECTS[mood];
    if (!effect) continue;

    stressScore += effect.stress ?? 0;
    energyScore += effect.energy ?? 0;

    if (effect.tag) addTag(effect.tag, 1);
  }

  /* -----------------------------
   * 3. Activities
   * ----------------------------- */
  for (const act of activities) {
    const effect = ACTIVITY_EFFECTS[act];
    if (!effect) continue;

    stressScore += effect.stress ?? 0;
    energyScore += effect.energy ?? 0;

    if (effect.tag) addTag(effect.tag, 2);
  }

  /* -----------------------------
   * 4. NOTE – strong signal
   * ----------------------------- */
  let noteImpact = 0;

  if (note.trim()) {
    for (const { pattern, effect } of NOTE_PATTERNS) {
      if (!pattern.test(note)) continue;

      stressScore += (effect.stress ?? 0) * 1.5;
      energyScore += (effect.energy ?? 0) * 1.5;

      if (effect.tag) {
        addTag(effect.tag, 3);
        noteTags.add(effect.tag);
        noteImpact++;
      }
    }
  }

  /* -----------------------------
   * 5. History – trend
   * ----------------------------- */
  const recent = history.slice(-5);

  const fatigueDays = recent.filter(h =>
    h.detailMoods?.some(d => DETAIL_MOOD_EFFECTS[d]?.tag === "fatigue")
  ).length;

  if (fatigueDays >= 2) {
    energyScore -= 2;
    addTag("chronic_fatigue", fatigueDays);
  }

  /* -----------------------------
   * 6. Levels
   * ----------------------------- */
  const stressLevel =
    stressScore >= 5 ? "high" :
    stressScore >= 2 ? "medium" :
    "low";

  const energyLevel =
    energyScore >= 3 ? "high" :
    energyScore <= -2 ? "low" :
    "medium";

  const tone =
    energyLevel === "high" ? "positive" :
    energyLevel === "low" ? "negative" :
    "neutral";

  const reasonTags: ReasonTag[] = Array.from(tagMap.entries()).map(
    ([tag, weight]) => ({ tag, weight })
  );

  const noteDominant = noteImpact >= 2;

  const summary = buildSummary({
    stressLevel,
    energyLevel,
    reasonTags,
  });

  return {
    tone,
    stressLevel,
    energyLevel,
    reasonTags,
    summary,
    noteDominant,
    primaryNoteTags: Array.from(noteTags),
  };
}

/* -----------------------------
 * Summary builder
 * ----------------------------- */
function buildSummary(insight: {
  stressLevel: MoodInsight["stressLevel"];
  energyLevel: MoodInsight["energyLevel"];
  reasonTags: ReasonTag[];
}) {
  if (insight.reasonTags.some(r => r.tag === "burnout_risk")) {
    return "Bạn có dấu hiệu quá tải kéo dài 🧠💔. Giảm nhịp và nghỉ sâu sẽ rất cần thiết lúc này.";
  }

  if (
    insight.stressLevel === "high" &&
    insight.reasonTags.some(r => r.tag === "deadline")
  ) {
    return "Deadline đang gây áp lực khá lớn 😣. Chia nhỏ công việc sẽ giúp bạn dễ thở hơn.";
  }

  if (insight.reasonTags.some(r => r.tag === "chronic_fatigue")) {
    return "Cơ thể bạn có dấu hiệu mệt kéo dài 🤍. Ngủ đủ và nghỉ ngơi là ưu tiên lúc này.";
  }

  if (insight.energyLevel === "low") {
    return "Bạn đang thiếu năng lượng. Nghỉ ngơi ngắn sẽ hiệu quả hơn là cố gắng thêm 🌿";
  }

  if (insight.energyLevel === "high") {
    return "Hôm nay bạn có năng lượng khá tốt 🌞. Hãy duy trì nhịp độ vừa phải.";
  }

  return "Hôm nay trạng thái của bạn khá ổn 🌱";
}
