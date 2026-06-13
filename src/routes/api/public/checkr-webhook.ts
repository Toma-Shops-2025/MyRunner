import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

// Checkr posts report status events here.
// Set CHECKR_WEBHOOK_SECRET in secrets to enable signature verification.
// On `report.completed`:
//   status=clear  -> background_check_status='clear', is_active=true
//   anything else -> background_check_status='failed', is_active=false
// (driver_role left in place; UI already shows a deactivated banner)

type CheckrEvent = {
  type: string;
  data?: { object?: { id?: string; candidate_id?: string; status?: string; adjudication?: string } };
};

function verifySignature(body: string, signature: string | null): boolean {
  const secret = process.env.CHECKR_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/checkr-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const sig = request.headers.get("x-checkr-signature");

        // If a secret is configured, require a valid signature.
        if (process.env.CHECKR_WEBHOOK_SECRET) {
          if (!verifySignature(body, sig)) {
            return new Response("Invalid signature", { status: 401 });
          }
        } else {
          console.warn("[checkr-webhook] CHECKR_WEBHOOK_SECRET not set; accepting without verification");
        }

        let event: CheckrEvent;
        try {
          event = JSON.parse(body);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        if (event.type !== "report.completed" && event.type !== "report.updated") {
          return new Response("ok");
        }

        const obj = event.data?.object ?? {};
        const candidateId = obj.candidate_id;
        const reportId = obj.id;
        const status = obj.status ?? "unknown";
        const adjudication = obj.adjudication ?? null;
        if (!candidateId) return new Response("ok");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Treat 'clear' (or 'consider' + engaged adjudication 'engaged') as pass
        const passing = status === "clear" || adjudication === "engaged";

        await supabaseAdmin
          .from("profiles")
          .update({
            checkr_report_id: reportId ?? null,
            checkr_report_status: status,
            background_check_status: passing ? "clear" : "failed",
            background_check_updated_at: new Date().toISOString(),
            is_active: passing,
          })
          .eq("checkr_candidate_id", candidateId);

        return new Response("ok");
      },
    },
  },
});
