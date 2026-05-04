// import { MoodLog } from "../types/mood";

// export async function generateMoodAnalysisAI(
//   moodLog: MoodLog
// ): Promise<string> {
//   try {
//     const res = await fetch("/api/mood-analysis", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(moodLog),
//     });

//     const data = await res.json();
//     return data.result ?? "Hôm nay trạng thái của bạn khá ổn 🌱";
//   } catch {
//     return "Hôm nay trạng thái của bạn khá ổn 🌱";
//   }
// }
