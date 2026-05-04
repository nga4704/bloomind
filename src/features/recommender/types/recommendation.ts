export type RecommendationAction = {
  id: string;
  title: string;
  description: string;
  category: "mind" | "body" | "quick";

  duration: {
    min: number;
    max: number;
  };

  exp: number;
};
