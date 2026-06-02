export type RecommendationCategory = "mind" | "body" | "quick";

export type RecommendationAction = {
  id: string;
  title: string;
  description: string;
  category: RecommendationCategory;

  duration: { min: number; max: number };
  exp: number;

  tags: string[];

  stressRelief: number;
  energyBoost: number;

  suitableFor: {
    lowEnergy?: boolean;
    highStress?: boolean;
  };

  score?: number;
  reason?: string;
};