import { NextRequest, NextResponse } from "next/server";

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("Missing OPENROUTER_API_KEY environment variable");
}

const SECTIONS = [
  "Procedure",
  "History",
  "Technique",
  "Comparison",
  "Lungs",
  "Pleura",
  "Cardiomediastinal",
  "Bones",
  "Impression"
] as const;

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    const prompt = `You are a highly skilled radiologist. Given the following text from a radiology report, determine which section it belongs to. The possible sections are: ${SECTIONS.join(", ")}.

Text: "${text}"

Respond with only the section name, nothing else. Choose the most appropriate section based on the content and medical context.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.SITE_URL as string,
        "X-Title": process.env.SITE_NAME as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const data = await response.json();
    const section = data.choices[0].message.content.trim();

    // Validate that the returned section is valid
    if (!SECTIONS.includes(section as any)) {
      throw new Error(`Invalid section returned: ${section}`);
    }

    return NextResponse.json({ section });
  } catch (error) {
    console.error("Section classification error:", error);
    return NextResponse.json(
      { error: "Section classification failed" },
      { status: 500 }
    );
  }
}
