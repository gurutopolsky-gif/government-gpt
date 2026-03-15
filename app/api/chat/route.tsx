import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages,
      system: "You are a helpful AI assistant. Give clear, concise answers.",
    });

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
