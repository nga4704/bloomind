// utils/generateRecommendations.ts
import { MoodLog } from "../types/mood";
import { RecommendationAction } from "../types/recommendation";
import { analyzeMood, MoodInsight } from "./moodAnalysis";

/**
 * Sinh gợi ý hành động từ mood hôm nay.
 * Chỉ dùng rule-based, không dùng AI.
 */
export async function generateRecommendations(
  todayMood: MoodLog,
  history: MoodLog[] = []
): Promise<RecommendationAction[]> {
  // 1️⃣ Phân tích mood theo rules
  const ruleInsight: MoodInsight = analyzeMood(todayMood, history);

  const energyLevel = ruleInsight.energyLevel;
  const stressLevel = ruleInsight.stressLevel;

  const actions: RecommendationAction[] = [];

  const hasTag = (tag: string) =>
    ruleInsight.reasonTags.some(r => r.tag === tag);

  /* -----------------------------
   * Burnout
   * ----------------------------- */
  if (hasTag("burnout")) {
    actions.push({
      id: "deep_rest",
      title: "Nghỉ sâu không màn hình",
      description: "Não và cơ thể cần được hồi phục thực sự",
      category: "body",
      duration: { min: 30, max: 45 },
      exp: 40,
    });
  }

  /* -----------------------------
   * Fatigue / buồn ngủ
   * ----------------------------- */
  if (hasTag("fatigue") || hasTag("sleep_deprivation")) {
    actions.push({
      id: "power_nap",
      title: "Chợp mắt 15–20 phút",
      description: "Phục hồi năng lượng trước khi tiếp tục",
      category: "body",
      duration: { min: 15, max: 20 },
      exp: 25,
    });
  }

  /* -----------------------------
   * Deadline + stress cao
   * ----------------------------- */
  if (stressLevel === "high" && hasTag("deadline")) {
    actions.push(
      {
        id: "pause",
        title: "Dừng lại & hít thở 3 phút",
        description: "Giảm căng thẳng tức thì",
        category: "quick",
        duration: { min: 3, max: 3 },
        exp: 5,
      },
      {
        id: "break_task",
        title: "Chia nhỏ việc gấp",
        description: "Chỉ tập trung vào bước nhỏ nhất",
        category: "mind",
        duration: { min: 5, max: 10 },
        exp: 10,
      }
    );
  }

  /* -----------------------------
   * Anxiety / stress
   * ----------------------------- */
  if (hasTag("stress") || hasTag("anxiety")) {
    actions.push({
      id: "grounding",
      title: "Bài tập 5–4–3–2–1",
      description: "Đưa tâm trí về hiện tại",
      category: "mind",
      duration: { min: 5, max: 7 },
      exp: 20,
    });
  }

  /* -----------------------------
   * Music (chỉ khi năng lượng không thấp)
   * ----------------------------- */
  if (energyLevel !== "low") {
    actions.push({
      id: "music",
      title: "Nghe nhạc nhẹ",
      description: "Giúp tâm trí dịu lại",
      category: "mind",
      duration: { min: 5, max: 15 },
      exp: 10,
    });
  }

  /* -----------------------------
   * Fallback an toàn
   * ----------------------------- */
  if (actions.length === 0) {
    actions.push({
      id: "rest",
      title: "Nghỉ 10 phút không màn hình",
      description: "Cho não được hồi phục",
      category: "body",
      duration: { min: 10, max: 10 },
      exp: 15,
    });
  }

  // Deduplicate + limit 3 actions
  const unique: RecommendationAction[] = actions.filter(
    (a, i, arr) => arr.findIndex(b => b.id === a.id) === i
  );

  return unique.slice(0, 3);
}
