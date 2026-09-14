import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { faqKnowledgeBlock, SUPPORT_POLICIES } from "@/lib/support-knowledge";
import { geminiJsonObject, geminiText } from "@/lib/gemini.server";

type ChatMsg = { role: "user" | "assistant"; content: string };

async function optionalUserId(): Promise<string | null> {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null;
    const request = getRequest();
    const authHeader = request?.headers?.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;
    const token = authHeader.slice(7);
    if (!token) return null;
    const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data } = await supabase.auth.getUser(token);
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

async function recentOrdersContext(userId: string): Promise<string> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("orders")
    .select("id, status, payment_status, dispatch_status, item_description, created_at, total_cents")
    .eq("customer_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);
  if (!data?.length) return "No recent orders for this signed-in customer.";
  return data
    .map(
      (o) =>
        `- order ${o.id.slice(0, 8)}… status=${o.status} payment=${o.payment_status} dispatch=${o.dispatch_status} item="${String(o.item_description || "").slice(0, 60)}" total_cents=${o.total_cents} created=${o.created_at}`,
    )
    .join("\n");
}

/** Public + signed-in customer AI assistant. */
export const askSupportAssistant = createServerFn({ method: "POST" })
  .inputValidator((d: { messages: ChatMsg[] }) => d)
  .handler(async ({ data }) => {
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
    return { reply: reply.trim() };
  });

/** Persist contact form + optional AI draft reply for ops. */
export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((d: { name: string; email: string; message: string }) => d)
  .handler(async ({ data }) => {
    const name = data.name?.trim();
    const email = data.email?.trim().toLowerCase();
    const message = data.message?.trim();
    if (!name || !email || !message) throw new Error("Name, email, and message are required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email.");

    let ai_category = "general";
    let ai_summary = message.slice(0, 200);
    let ai_priority = "normal";
    try {
      const triage = await geminiJsonObject(
        `Classify a MyRunner contact form message. Return JSON: {"category":"billing|delivery|driver|partnership|safety|other","priority":"low|normal|high|urgent","summary":"one sentence"}`,
        `From: ${name} <${email}>\n\n${message}`,
      );
      if (typeof triage.category === "string") ai_category = triage.category;
      if (typeof triage.priority === "string") ai_priority = triage.priority;
      if (typeof triage.summary === "string") ai_summary = triage.summary;
    } catch {
      /* triage optional */
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Table created by supabase/scripts/support-ai.sql
    const { error } = await (supabaseAdmin as any).from("contact_messages").insert({
      name,
      email,
      message,
      ai_category,
      ai_priority,
      ai_summary,
      status: "open",
    });

    if (error) {
      console.error("[contact] insert failed", error.message);
      throw new Error(
        String(error.message).includes("contact_messages") || String(error.message).includes("schema cache")
          ? "Support inbox not set up yet — run supabase/scripts/support-ai.sql in Supabase, then try again."
          : error.message,
      );
    }

    return { ok: true as const, ai_priority, ai_summary };
  });

/** After a safety report is filed, AI triages severity for admin. */
export const triageSafetyReport = createServerFn({ method: "POST" })
  .inputValidator((d: { reportId: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: report, error } = await supabaseAdmin
      .from("reports")
      .select("id, category, details, status")
      .eq("id", data.reportId)
      .maybeSingle();
    if (error || !report) throw new Error(error?.message ?? "Report not found");

    const triage = await geminiJsonObject(
      `You triage MyRunner safety reports. Return JSON only:
{"severity":"low|medium|high|critical","summary":"one sentence for admin","labels":["short","tags"],"escalate":true|false,"suggested_action":"short next step"}
critical = immediate danger, sexual misconduct, credible threats, active theft in progress.
high = harassment, discrimination, intoxication, damaged/stolen goods with clear claim.
medium = inappropriate behavior, spam/fraud suspicion.
low = vague other / incomplete.`,
      `Category: ${report.category}\n\nDetails:\n${report.details}`,
    );

    const severity = typeof triage.severity === "string" ? triage.severity : "medium";
    const summary = typeof triage.summary === "string" ? triage.summary : "";
    const labels = Array.isArray(triage.labels) ? triage.labels.map(String) : [];
    const escalate = Boolean(triage.escalate);
    const suggested_action = typeof triage.suggested_action === "string" ? triage.suggested_action : "";

    const { error: upErr } = await (supabaseAdmin as any)
      .from("reports")
      .update({
        ai_severity: severity,
        ai_summary: summary,
        ai_labels: labels,
        ai_escalate: escalate,
        ai_suggested_action: suggested_action,
      })
      .eq("id", report.id);

    if (upErr) {
      // Columns may not exist yet — append triage into details so admin still sees it
      const stamped = `${report.details}\n\n---\nAI triage: ${severity.toUpperCase()} | ${summary}\nAction: ${suggested_action}\nLabels: ${labels.join(", ")}`;
      await supabaseAdmin.from("reports").update({ details: stamped }).eq("id", report.id);
      return { ok: true as const, severity, summary, escalate, persisted: "details_fallback" as const };
    }

    return { ok: true as const, severity, summary, escalate, persisted: "columns" as const };
  });
