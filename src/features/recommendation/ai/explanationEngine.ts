import { RecommendationAction } from "../types/recommendation";
import { MoodFeatures } from "../core/featureExtractor";

export function explainRecommendation(
  action: RecommendationAction,
  f: MoodFeatures
) {
  if (f.stress > 2 && action.tags.includes("stress")) {
    return "Phù hợp vì giúp giảm căng thẳng hiện tại";
  }

  if (f.energy < 0 && action.tags.includes("fatigue")) {
    return "Hỗ trợ phục hồi năng lượng";
  }

  return "Phù hợp với trạng thái hiện tại của bạn";
}