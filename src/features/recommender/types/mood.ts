export interface MoodLog {
  date: string;
  moodId: string;
  moodLabel: string;
  detailMoods: string[];
  activities: string[];
  note?: string;
}
