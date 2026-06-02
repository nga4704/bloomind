import { RecommendationAction } from "../types/recommendation";
import { MoodFeatures } from "./featureExtractor";

export function computeScore(
  action: RecommendationAction,
  f: MoodFeatures,
  historyBoost = 0
) {
  let score = 10;

  // match energy
  if (f.energy < 0 && action.suitableFor.lowEnergy) {
    score += 35;
  }

  // match stress
  if (f.stress > 2 && action.suitableFor.highStress) {
    score += 35;
  }

  // tag matching (pseudo similarity)
  const overlap = action.tags.filter(t => f.tags.includes(t)).length;
  score += overlap * 8;

  // action effect weight
  score += action.stressRelief * 2;
  score += action.energyBoost * 2;

  // personalization
  score += historyBoost;

  return score;
}