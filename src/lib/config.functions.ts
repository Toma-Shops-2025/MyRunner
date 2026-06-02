import { createServerFn } from "@tanstack/react-start";

export const getPublicConfig = createServerFn({ method: "GET" }).handler(async () => {
  return {
    mapboxToken: process.env.MAPBOX_PUBLIC_TOKEN ?? "",
    stripePublishableKey: process.env.VITE_PAYMENTS_CLIENT_TOKEN ?? "",
  };
});
