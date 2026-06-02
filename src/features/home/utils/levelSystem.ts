export function getLevel(exp: number) {
  return Math.floor(exp / 100) + 1;
}

export function getLevelProgress(exp: number) {
  const currentLevelExp = exp % 100;
  return currentLevelExp;
}

export function getProgressPercent(exp: number) {
  return Math.min((exp % 100) / 100, 1);
}

export function getNextLevelExp(exp: number) {
  return 100 - (exp % 100);
}