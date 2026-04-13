import { streamText, type ModelMessage } from "ai";
import { getLanguageModel } from "@/lib/ai/providers";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are Friendly Chatbot, a helpful, knowledgeable, and concise AI assistant.

Guidelines:
- Always respond using proper Markdown formatting
- Use code blocks with language specifiers for all code (e.g. \`\`\`typescript)
- Structure long answers with headings and bullet points for clarity
- Be direct and avoid unnecessary filler text
- For coding questions: provide working, well-commented code examples
- For factual questions: be accurate and cite your reasoning
- Keep responses focused and well-organized`;

/**
 * Normalize incoming messages to ModelMessage format.
 * The AI SDK v6 client sends UIMessages with .parts arrays,
 * but streamText expects ModelMessages with .content strings.
 */
function toModelMessages(raw: any[]): ModelMessage[] {
  return raw.map((m) => {
    // Already has string content (ModelMessage format)
    if (typeof m.content === "string") {
      return { role: m.role, content: m.content } as ModelMessage;
    }
    // UIMessage format: extract text from parts
    if (Array.isArray(m.parts)) {
      const text = m.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("");
      return { role: m.role, content: text } as ModelMessage;
    }
    // Array content (multi-part ModelMessage) — pass through
    if (Array.isArray(m.content)) {
      return { role: m.role, content: m.content } as ModelMessage;
    }
    return { role: m.role, content: "" } as ModelMessage;
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const rawMessages: any[] = body.messages ?? [];

    if (rawMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const messages = toModelMessages(rawMessages);

    const result = streamText({
      model: getLanguageModel(),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.7,
      maxOutputTokens: 4096,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[Chat API Error]:", error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
