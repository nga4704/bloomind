import { corsHeaders } from "./_utils/cors";

export const config = {
  runtime: "edge",
};

/* ================================
   SYSTEM PROMPT
================================ */
const SYSTEM_PROMPT = `
Bạn là Bloomie — một người bạn thân, ấm áp và tinh tế.

Nguyên tắc:
- Luôn phản ánh cảm xúc người dùng trước (ví dụ: "nghe có vẻ bạn đang...")
- Trả lời như người thật, không robot
- Tránh lời khuyên cứng nhắc
- Tạo cảm giác an toàn và được lắng nghe

Cách nói:
- Tiếng Việt tự nhiên
- 2–4 câu
- Tối đa 1 câu hỏi (không bắt buộc)
- Có thể dùng từ nhẹ nhàng như: "mình", "có vẻ", "một chút"

KHÔNG:
- Không giảng đạo
- Không phân tích như bác sĩ
- Không dùng bullet points
`;
const emotionalHint = `
Nếu mood là "neutral" → nhẹ nhàng, không quá sâu
Nếu mood là "sad" → đồng cảm nhiều hơn
Nếu mood là "happy" → tích cực, chia sẻ niềm vui
`;

/* ================================
   CALL GROQ
================================ */
async function callGroq(messages: any[], apiKey: string) {
  return fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.8,
      max_tokens: 300,
      messages,
    }),
  });
}

/* ================================
   TITLE
================================ */
async function generateTitle(message: string, apiKey: string) {
  const res = await callGroq(
    [
      {
        role: "system",
        content: "Tạo tiêu đề ngắn (3-6 từ) bằng tiếng Việt.",
      },
      { role: "user", content: message },
    ],
    apiKey
  );

  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || "Cuộc trò chuyện";
}

/* ================================
   PERSONALITY
================================ */
async function analyzeUser(message: string, apiKey: string) {
  const res = await callGroq(
    [
      {
        role: "system",
        content:
          "Phân tích tính cách người dùng trong 1 câu ngắn (ví dụ: hay lo lắng, tích cực...).",
      },
      { role: "user", content: message },
    ],
    apiKey
  );

  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}
declare const process: {
  env: {
    GROQ_API_KEY?: string;
  };
};

/* ================================
   HANDLER
================================ */
export default async function handler(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { message, history, moodToday, userProfile } =
      await req.json();

    const API_KEY = process.env.GROQ_API_KEY;

    if (!API_KEY) {
      return new Response(
        JSON.stringify({ reply: "Missing API KEY" }),
        { status: 500, headers: corsHeaders }
      );
    }

    /* ================================
       CONTEXT
    ================================ */
    const context = `
      Mood hôm nay: ${moodToday?.moodLabel || "không có"}
      Chi tiết cảm xúc: ${moodToday?.detailMoods?.join(", ") || ""}
      Hoạt động: ${moodToday?.activities?.join(", ") || ""}
      Ghi chú: ${moodToday?.note || "không có"}

      Tính cách người dùng:
      ${userProfile || "chưa rõ"}
      `;

    const chatHistory = (history ?? []).slice(-10).map((m: any) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

    const messages = [
      { role: "system", content: SYSTEM_PROMPT + context },
      ...chatHistory,
      { role: "user", content: message },
    ];

    const res = await callGroq(messages, API_KEY);
    const data = await res.json();

    const reply = data?.choices?.[0]?.message?.content;

    /* ================================
       EXTRA
    ================================ */
    let title = null;
    let personality = null;

    if (!history || history.length === 0) {
      title = await generateTitle(message, API_KEY);
    }

    personality = await analyzeUser(
      userProfile + "\n" + message,
      API_KEY
    );

    return new Response(
      JSON.stringify({
        reply,
        title,
        personality,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ reply: "Server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
}