export function calculateAccuracy(
  recommendedCount: number,
  doneCount: number
) {
  if (recommendedCount === 0) return 0;

  return Number(
    ((doneCount / recommendedCount) * 100).toFixed(2)
  );
}

export function calculatePrecisionAtK(
  recommendedCount: number,
  doneCount: number
) {
  if (recommendedCount === 0) return 0;

  return Number(
    (doneCount / recommendedCount).toFixed(4)
  );
}

export function calculateRecallAtK(
  relevantCount: number,
  doneCount: number
) {
  if (relevantCount === 0) return 0;

  return Number(
    (doneCount / relevantCount).toFixed(4)
  );
}

export function calculateF1Score(
  precision: number,
  recall: number
) {
  if (precision + recall === 0) return 0;

  return Number(
    (
      (2 * precision * recall) /
      (precision + recall)
    ).toFixed(4)
  );
}

export function calculateEngagementRate(
  recommendedCount: number,
  doneCount: number
) {
  if (recommendedCount === 0) return 0;

  return Number(
    (
      (doneCount / recommendedCount) *
      100
    ).toFixed(2)
  );
}