import { createGroq } from "@ai-sdk/groq";

const groqProvider = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Returns the primary Groq language model (llama-3.3-70b-versatile).
 * This is Groq's fastest large model, available on the free tier.
 */
export function getLanguageModel() {
  return groqProvider("llama-3.3-70b-versatile");
}
