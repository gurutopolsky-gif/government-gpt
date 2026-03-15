import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

const GREETING_REGEX =
  /^(hi|hello|hey|salam|salaam|assalamualaikum|as-salamu alaykum|hi there|hello there)\b/i;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];

  if (GREETING_REGEX.test((lastMessage?.content || "").trim())) {
    const result = streamText({
      model: openai("gpt-4o-mini"),
      temperature: 0,
      system:
        "Reply with exactly this single sentence and nothing else: Hi, how can I assist you?",
      messages: [{ role: "user", content: lastMessage.content }],
    });

    return result.toDataStreamResponse();
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    system:
      "You are a helpful AI assistant. Give clear, concise, accurate responses. If the user asks about government policy and you are unsure, say so clearly instead of guessing.",
    temperature: 0.3,
  });

  return result.toDataStreamResponse();
}
