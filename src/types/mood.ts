export type MoodLog = {
  date: string;
  moodId: string;
  moodLabel?: string;
  note: string;
  activities: string[];
  detailMoods: string[];
};