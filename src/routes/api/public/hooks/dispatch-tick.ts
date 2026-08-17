import { createFileRoute } from "@tanstack/react-router";
import { reassignExpired } from "@/lib/dispatch.functions";

function authorizeCron(request: Request): Response | null {
  const secret = process.env.DISPATCH_CRON_SECRET;
  if (!secret) return null;
  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (auth !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }
  return null;
}

// Called every ~15–30s by an external cron (or pg_cron) to expire stale offers and dispatch queued orders.
// POST https://myrunner.shop/api/public/hooks/dispatch-tick
// Header: Authorization: Bearer <DISPATCH_CRON_SECRET>
export const Route = createFileRoute("/api/public/hooks/dispatch-tick")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const denied = authorizeCron(request);
        if (denied) return denied;
        const result = await reassignExpired();
        return Response.json(result);
      },
    },
  },
});
