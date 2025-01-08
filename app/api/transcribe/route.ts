import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';
export const maxDuration = 30;

if (!process.env.GROQ_API_KEY || !process.env.OPENROUTER_API_KEY) {
  throw new Error("Missing required API keys");
}

async function enhanceText(text: string) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
        'X-Title': process.env.SITE_NAME || 'Laudos.AI',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a medical transcription enhancement system. Your task is to improve the clarity and accuracy of medical dictations while maintaining their original meaning. Focus on proper medical terminology, formatting, and structure.'
          },
          {
            role: 'user',
            content: `Please enhance this medical dictation while preserving its meaning: ${text}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error('Enhancement failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Enhancement error:', error);
    return text;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert audio to base64
    const buffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(buffer).toString("base64");

    // Call Groq Whisper API
    const transcriptionResponse = await fetch("https://api.groq.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "whisper-large-v3-turbo",
        file: base64Audio,
        response_format: "json",
        language: "en",
      }),
    });

    if (!transcriptionResponse.ok) {
      const error = await transcriptionResponse.text();
      throw new Error(`Groq API error: ${error}`);
    }

    const transcriptionData = await transcriptionResponse.json();
    
    // Enhance the transcribed text
    const enhancedText = await enhanceText(transcriptionData.text);

    return NextResponse.json({ 
      text: enhancedText,
      original: transcriptionData.text,
      metadata: {
        processing_time: Date.now(),
        model: "whisper-large-v3-turbo + deepseek-chat",
      }
    });
  } catch (error) {
    console.error("Processing error:", error);
    return NextResponse.json(
      { error: "Processing failed" },
      { status: 500 }
    );
  }
}
