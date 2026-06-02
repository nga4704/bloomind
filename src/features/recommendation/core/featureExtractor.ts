import { MoodLog } from "../../../types/mood";

export type MoodFeatures = {
  stress: number;
  energy: number;
  tags: string[];
};

export function extractFeatures(mood: MoodLog): MoodFeatures {
  console.log("MOOD INPUT:", mood);
  let stress = 0;
  let energy = 0;
  const tags: string[] = [];

  if (["sad", "anxious"].includes(mood.moodId)) stress += 2;
  if (mood.moodId === "happy") energy += 2;
  if (mood.moodId === "peaceful") stress -= 1;

  for (const m of mood.detailMoods || []) {
    if (m === "fatigue") energy -= 2;
    if (m === "anxiety") stress += 2;
    tags.push(m);
  }

  for (const a of mood.activities || []) {
    if (a === "stress") stress += 1;
    if (a === "sleep") energy -= 1;
  }

  return { stress, energy, tags };
}