import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

const GREETING_REGEX =
  /^(hi|hello|hey|salam|salaam|assalamualaikum|as-salamu alaykum|hi there|hello there)\b/i;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    if (GREETING_REGEX.test((lastMessage?.content || "").trim())) {
      return NextResponse.json({
        message: "Hi, how can I assist you?",
      });
    }

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages,
      system:
        "You are a helpful AI assistant. Give clear, concise, accurate responses.",
      temperature: 0.3,
    });

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
