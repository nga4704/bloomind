import { ACTIVITY_CATALOG } from "../data/activityCatalog";
import { MoodLog } from "../../../types/mood";

/**
 * RULE ENGINE
 */
function ruleScore(activity: any, mood: MoodLog) {
  let score = 0;

  if (
    mood.moodId === "sad" &&
    activity.tags.includes("sad")
  ) {
    score += 30;
  }

  if (
    mood.moodId === "sad" &&
    activity.tags.includes("fatigue")
  ) {
    score += 20;
  }

  if (
    mood.moodId === "anxious" &&
    activity.tags.includes("stress")
  ) {
    score += 30;
  }

  if (
    mood.moodId === "anxious" &&
    activity.tags.includes("anxiety")
  ) {
    score += 35;
  }

  if (
    mood.moodId === "happy" &&
    activity.tags.includes("happy")
  ) {
    score += 30;
  }

  if (
    mood.moodId === "happy" &&
    activity.tags.includes("movement")
  ) {
    score += 20;
  }

  return score;
}

/**
 * CONTEXT SCORE
 */
function contextScore(activity: any, mood: MoodLog) {
  let score = 0;

  if (
    mood.activities?.length === 0 &&
    activity.category === "body"
  ) {
    score += 10;
  }

  if (
    mood.note?.toLowerCase().includes("mệt")
  ) {
    if (activity.suitableFor?.lowEnergy) {
      score += 15;
    }
  }

  return score;
}

function calculateScore(
  activity: any,
  mood: MoodLog
) {
  const base =
    ruleScore(activity, mood) || 0;

  const ctx =
    contextScore(activity, mood) || 0;

  return (
    base +
    ctx +
    Math.random() * 3
  );
}

export function rankRecommendations(
  mood: MoodLog
) {
  return ACTIVITY_CATALOG
    .map((activity) => ({
      ...activity,
      score: calculateScore(
        activity,
        mood
      ),
      reason: generateReason(
        activity,
        mood
      ),
    }))
    .sort(
      (a, b) =>
        (b.score || 0) -
        (a.score || 0)
    )
    .slice(0, 3); // TOP 3
}

/**
 * Explainable AI
 */
function generateReason(
  activity: any,
  mood: MoodLog
) {
  if (
    mood.moodId === "anxious" &&
    activity.tags.includes("stress")
  ) {
    return "Phù hợp vì bạn đang căng thẳng";
  }

  if (
    mood.moodId === "sad" &&
    activity.tags.includes("sad")
  ) {
    return "Giúp cải thiện tâm trạng hiện tại";
  }

  if (
    mood.moodId === "happy" &&
    activity.tags.includes("happy")
  ) {
    return "Giúp duy trì cảm xúc tích cực";
  }

  return "Được đề xuất dựa trên trạng thái hiện tại";
}