/**
 * Google Gemini for MyRunner support + triage.
 * Set GEMINI_API_KEY in Netlify (Google AI Studio).
 */

const BASE = "https://generativelanguage.googleapis.com/v1beta";
const TEXT_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-3.5-flash-lite"] as const;
const FETCH_MS = 20_000;

export function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error("GEMINI_API_KEY is not configured");
  return key.replace(/^["']|["']$/g, "");
}

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  error?: { message?: string };
};

async function generateContent(model: string, body: Record<string, unknown>): Promise<GeminiResponse> {
  const key = getGeminiApiKey();
  let res: Response;
  try {
    res = await fetch(`${BASE}/models/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(FETCH_MS),
    });
  } catch (e) {
    const name = e instanceof Error ? e.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      throw new Error("Assistant timed out — try again in a moment");
    }
    throw e instanceof Error ? e : new Error(String(e));
  }
  const json = (await res.json()) as GeminiResponse;
  if (!res.ok) throw new Error(json.error?.message ?? `Gemini error ${res.status}`);
  return json;
}

async function withModels<T>(run: (model: string) => Promise<T>): Promise<T> {
  let lastErr: Error | null = null;
  for (const model of TEXT_MODELS) {
    try {
      return await run(model);
    } catch (e) {
      lastErr = e instanceof Error ? e : new Error(String(e));
      const msg = lastErr.message.toLowerCase();
      if (msg.includes("api key") || msg.includes("403") || msg.includes("401") || msg.includes("quota")) {
        break;
      }
    }
  }
  throw lastErr ?? new Error("Gemini request failed");
}

export async function geminiText(system: string, user: string, temperature = 0.4): Promise<string> {
  return withModels(async (model) => {
    const json = await generateContent(model, {
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: { temperature },
    });
    const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim() ?? "";
    if (!text) throw new Error(`${model}: empty response`);
    return text;
  });
}

export async function geminiJsonObject(
  system: string,
  user: string,
  temperature = 0.2,
): Promise<Record<string, unknown>> {
  return withModels(async (model) => {
    const json = await generateContent(model, {
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature,
      },
    });
    const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim() ?? "";
    if (!text) throw new Error(`${model}: empty response`);
    try {
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]) as Record<string, unknown>;
      throw new Error(`${model}: response was not valid JSON`);
    }
  });
}
