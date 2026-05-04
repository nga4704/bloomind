// utils/aiRefinement.ts
import OpenAI from "openai";
import { MoodLog } from "../types/mood";
import { MoodInsight } from "../services/moodAnalysis";

export type AIRefinement = {
  overrideEnergyLevel?: "low" | "medium" | "high";
  overrideStressLevel?: "low" | "medium" | "high";
  suppressActions?: string[];
  boostActions?: string[];
  reasoning?: string;
};

// ✅ Kiểm tra biến môi trường
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable!");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildPrompt(input: {
  moodLog: MoodLog;
  ruleInsight: MoodInsight;
}) {
  return `
You are a mental health assistant.

USER DATA (JSON):
${JSON.stringify(input, null, 2)}

RULES:
- Do NOT suggest stimulation (music, focus) if sleepy or fatigued
- Deadline + sleep deprivation → recovery first
- Be conservative, realistic, humane

Return ONLY valid JSON:
{
  "overrideEnergyLevel": "low|medium|high|omit",
  "overrideStressLevel": "low|medium|high|omit",
  "suppressActions": [],
  "boostActions": [],
  "reasoning": "short"
}
`;
}

export async function refineInsightWithAI(
  moodLog: MoodLog,
  ruleInsight: MoodInsight
): Promise<AIRefinement | null> {
  try {
    const res = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: "You are precise and conservative." },
        { role: "user", content: buildPrompt({ moodLog, ruleInsight }) },
      ],
    });

    const content = res.choices[0].message.content;
    if (!content) return null;

    return JSON.parse(content);
  } catch (e) {
    console.warn("AI refinement failed", e);
    return null;
  }
}
