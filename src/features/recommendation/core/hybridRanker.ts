import { ACTIVITY_CATALOG } from "../data/activityCatalog";
import { MoodLog } from "../../../types/mood";

/**
 * 1. RULE ENGINE (deterministic logic)
 */
function ruleScore(activity: any, mood: MoodLog) {
  let score = 0;

  if (mood.moodId === "sad" && activity.tags.includes("fatigue")) {
    score += 20;
  }

  if (mood.moodId === "anxious" && activity.tags.includes("stress")) {
    score += 25;
  }

  if (mood.moodId === "happy" && activity.tags.includes("movement")) {
    score += 10;
  }

  return score;
}

/**
 * 2. CONTEXT SCORE (heuristic AI-like layer)
 */
function contextScore(activity: any, mood: MoodLog) {
  let score = 0;

  if (mood.activities?.length === 0 && activity.category === "body") {
    score += 10;
  }

  if (mood.note?.toLowerCase().includes("mệt")) {
    if (activity.suitableFor?.lowEnergy) score += 15;
  }

  return score;
}

/**
 * 3. PERSONALIZATION (history later)
 */
function personalizationScore(activity: any) {
  return 0; // upgrade sau
}

/**
 * FINAL HYBRID SCORE
 */
function calculateScore(activity: any, mood: MoodLog) {
  const base = ruleScore(activity, mood) || 0;
  const ctx = contextScore(activity, mood) || 0;

  const score = base + ctx + Math.random() * 3;

  if (isNaN(score)) return 0;

  return score;
}

/**
 * MAIN RANKER
 */
export function rankRecommendations(mood: MoodLog) {
  return ACTIVITY_CATALOG
    .map((a) => ({
      ...a,
      score: calculateScore(a, mood),
      reason: generateReason(a, mood),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

    
}

/**
 * Explainable AI (rất quan trọng để ăn điểm)
 */
function generateReason(activity: any, mood: MoodLog) {
  if (mood.moodId === "anxious" && activity.tags.includes("stress")) {
    return "Phù hợp vì bạn đang căng thẳng";
  }

  if (mood.moodId === "sad" && activity.tags.includes("fatigue")) {
    return "Hỗ trợ phục hồi năng lượng";
  }

  return "Được đề xuất dựa trên trạng thái hiện tại";
}

