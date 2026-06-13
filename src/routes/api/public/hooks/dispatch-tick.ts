import { createFileRoute } from "@tanstack/react-router";
import { reassignExpired } from "@/lib/dispatch.functions";

// Called every ~15s by pg_cron to expire stale offers and dispatch queued orders.
export const Route = createFileRoute("/api/public/hooks/dispatch-tick")({
  server: {
    handlers: {
      POST: async () => {
        const result = await reassignExpired();
        return Response.json(result);
      },
    },
  },
});
