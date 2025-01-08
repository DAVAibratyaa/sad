import { NextRequest, NextResponse } from "next/server";

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("Missing OPENROUTER_API_KEY environment variable");
}

export async function POST(request: NextRequest) {
  try {
    const { text, section } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    const prompt = `You are a highly skilled radiologist. Enhance the following ${section} text to be more professional, accurate, and clear while maintaining its medical meaning. Include relevant medical terminology where appropriate:

${text}

Provide only the enhanced text without any explanations or additional comments.`;

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
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const data = await response.json();
    return NextResponse.json({ 
      text: data.choices[0].message.content.trim() 
    });
  } catch (error) {
    console.error("Text enhancement error:", error);
    return NextResponse.json(
      { error: "Text enhancement failed" },
      { status: 500 }
    );
  }
}
