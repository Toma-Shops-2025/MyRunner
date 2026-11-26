import { c as createServerRpc } from "./createServerRpc-C3IsetnU.mjs";
import { c as createServerFn, g as getRequest } from "./server-pkl-8gUD.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { S as SUPPORT_POLICIES, f as faqKnowledgeBlock } from "./support-knowledge-BldCmBQ4.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const BASE = "https://generativelanguage.googleapis.com/v1beta";
const TEXT_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-3.5-flash-lite"];
const FETCH_MS = 2e4;
function getGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error("GEMINI_API_KEY is not configured");
  return key.replace(/^["']|["']$/g, "");
}
async function generateContent(model, body) {
  const key = getGeminiApiKey();
  let res;
  try {
    res = await fetch(`${BASE}/models/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(FETCH_MS)
    });
  } catch (e) {
    const name = e instanceof Error ? e.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      throw new Error("Assistant timed out — try again in a moment");
    }
    throw e instanceof Error ? e : new Error(String(e));
  }
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? `Gemini error ${res.status}`);
  return json;
}
async function withModels(run) {
  let lastErr = null;
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
async function geminiText(system, user, temperature = 0.4) {
  return withModels(async (model) => {
    const json = await generateContent(model, {
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: { temperature }
    });
    const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim() ?? "";
    if (!text) throw new Error(`${model}: empty response`);
    return text;
  });
}
async function geminiJsonObject(system, user, temperature = 0.2) {
  return withModels(async (model) => {
    const json = await generateContent(model, {
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature
      }
    });
    const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim() ?? "";
    if (!text) throw new Error(`${model}: empty response`);
    try {
      return JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      throw new Error(`${model}: response was not valid JSON`);
    }
  });
}
async function optionalUserId() {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null;
    const request = getRequest();
    const authHeader = request?.headers?.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;
    const token = authHeader.slice(7);
    if (!token) return null;
    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    const {
      data
    } = await supabase.auth.getUser(token);
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}
async function recentOrdersContext(userId) {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data
  } = await supabaseAdmin.from("orders").select("id, status, payment_status, dispatch_status, item_description, created_at, total_cents").eq("customer_id", userId).order("created_at", {
    ascending: false
  }).limit(5);
  if (!data?.length) return "No recent orders for this signed-in customer.";
  return data.map((o) => `- order ${o.id.slice(0, 8)}… status=${o.status} payment=${o.payment_status} dispatch=${o.dispatch_status} item="${String(o.item_description || "").slice(0, 60)}" total_cents=${o.total_cents} created=${o.created_at}`).join("\n");
}
const askSupportAssistant_createServerFn_handler = createServerRpc({
  id: "5c7f3b6c6dd08d9a4d93fde213d7f10e6468f59723bef008fa924bd1c223fcb8",
  name: "askSupportAssistant",
  filename: "src/lib/support.functions.ts"
}, (opts) => askSupportAssistant.__executeServer(opts));
const askSupportAssistant = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(askSupportAssistant_createServerFn_handler, async ({
  data
}) => {
  const messages = (data.messages || []).filter((m) => m.content?.trim()).slice(-12);
  if (!messages.length) throw new Error("Say something so I can help.");
  const userId = await optionalUserId();
  let orderBlock = "Guest (not signed in) — no order lookup.";
  if (userId) {
    try {
      orderBlock = await recentOrdersContext(userId);
    } catch {
      orderBlock = "Signed in, but order lookup failed.";
    }
  }
  const system = `You are MyRunner Support Assistant for myrunner.shop — an on-demand local delivery marketplace (not rideshare).
Be concise, friendly, and practical. Use short paragraphs or bullets.
Only answer from POLICY + FAQ + ORDER CONTEXT below. If you don't know, say so and suggest emailing support@myrunner.shop or using Report for safety issues.
Never invent refund amounts, legal advice, or guarantee ETAs beyond published averages.
For emergencies: tell them to call local emergency services first.
If they ask about a specific live order, use ORDER CONTEXT; never expose other customers' data.

POLICY:
${SUPPORT_POLICIES}

FAQ:
${faqKnowledgeBlock()}

ORDER CONTEXT:
${orderBlock}`;
  const transcript = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
  const reply = await geminiText(system, transcript, 0.35);
  return {
    reply: reply.trim()
  };
});
const submitContactMessage_createServerFn_handler = createServerRpc({
  id: "991eae88ac8999d518f199c713618e0e44c024e5157371cb2ece8d4bbd0eb014",
  name: "submitContactMessage",
  filename: "src/lib/support.functions.ts"
}, (opts) => submitContactMessage.__executeServer(opts));
const submitContactMessage = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(submitContactMessage_createServerFn_handler, async ({
  data
}) => {
  const name = data.name?.trim();
  const email = data.email?.trim().toLowerCase();
  const message = data.message?.trim();
  if (!name || !email || !message) throw new Error("Name, email, and message are required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email.");
  let ai_category = "general";
  let ai_summary = message.slice(0, 200);
  let ai_priority = "normal";
  try {
    const triage = await geminiJsonObject(`Classify a MyRunner contact form message. Return JSON: {"category":"billing|delivery|driver|partnership|safety|other","priority":"low|normal|high|urgent","summary":"one sentence"}`, `From: ${name} <${email}>

${message}`);
    if (typeof triage.category === "string") ai_category = triage.category;
    if (typeof triage.priority === "string") ai_priority = triage.priority;
    if (typeof triage.summary === "string") ai_summary = triage.summary;
  } catch {
  }
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    error
  } = await supabaseAdmin.from("contact_messages").insert({
    name,
    email,
    message,
    ai_category,
    ai_priority,
    ai_summary,
    status: "open"
  });
  if (error) {
    console.error("[contact] insert failed", error.message);
    throw new Error(String(error.message).includes("contact_messages") || String(error.message).includes("schema cache") ? "Support inbox not set up yet — run supabase/scripts/support-ai.sql in Supabase, then try again." : error.message);
  }
  return {
    ok: true,
    ai_priority,
    ai_summary
  };
});
const triageSafetyReport_createServerFn_handler = createServerRpc({
  id: "6ac62bd8ed50dbb9dff3486842de5b38002caaaa78b6a31f62c3eb6f900f4879",
  name: "triageSafetyReport",
  filename: "src/lib/support.functions.ts"
}, (opts) => triageSafetyReport.__executeServer(opts));
const triageSafetyReport = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(triageSafetyReport_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const {
    data: report,
    error
  } = await supabaseAdmin.from("reports").select("id, category, details, status").eq("id", data.reportId).maybeSingle();
  if (error || !report) throw new Error(error?.message ?? "Report not found");
  const triage = await geminiJsonObject(`You triage MyRunner safety reports. Return JSON only:
{"severity":"low|medium|high|critical","summary":"one sentence for admin","labels":["short","tags"],"escalate":true|false,"suggested_action":"short next step"}
critical = immediate danger, sexual misconduct, credible threats, active theft in progress.
high = harassment, discrimination, intoxication, damaged/stolen goods with clear claim.
medium = inappropriate behavior, spam/fraud suspicion.
low = vague other / incomplete.`, `Category: ${report.category}

Details:
${report.details}`);
  const severity = typeof triage.severity === "string" ? triage.severity : "medium";
  const summary = typeof triage.summary === "string" ? triage.summary : "";
  const labels = Array.isArray(triage.labels) ? triage.labels.map(String) : [];
  const escalate = Boolean(triage.escalate);
  const suggested_action = typeof triage.suggested_action === "string" ? triage.suggested_action : "";
  const {
    error: upErr
  } = await supabaseAdmin.from("reports").update({
    ai_severity: severity,
    ai_summary: summary,
    ai_labels: labels,
    ai_escalate: escalate,
    ai_suggested_action: suggested_action
  }).eq("id", report.id);
  if (upErr) {
    const stamped = `${report.details}

---
AI triage: ${severity.toUpperCase()} | ${summary}
Action: ${suggested_action}
Labels: ${labels.join(", ")}`;
    await supabaseAdmin.from("reports").update({
      details: stamped
    }).eq("id", report.id);
    return {
      ok: true,
      severity,
      summary,
      escalate,
      persisted: "details_fallback"
    };
  }
  return {
    ok: true,
    severity,
    summary,
    escalate,
    persisted: "columns"
  };
});
export {
  askSupportAssistant_createServerFn_handler,
  submitContactMessage_createServerFn_handler,
  triageSafetyReport_createServerFn_handler
};
