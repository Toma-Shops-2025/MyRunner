import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getPublicConfig } from "@/lib/config.functions";

export function OrderMap({
  pickup,
  dropoff,
  className = "",
}: {
  pickup: string;
  dropoff: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    getPublicConfig().then((c) => setToken(c.mapboxToken));
  }, []);

  useEffect(() => {
    if (!token || !ref.current) return;
    mapboxgl.accessToken = token;

    let map: mapboxgl.Map | null = null;
    (async () => {
      const geocode = async (q: string): Promise<[number, number] | null> => {
        const r = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${token}&limit=1`,
        );
        const j = (await r.json()) as { features?: { center: [number, number] }[] };
        return j.features?.[0]?.center ?? null;
      };

      const [p, d] = await Promise.all([geocode(pickup), geocode(dropoff)]);
      if (!ref.current) return;

      const center = p ?? d ?? [-98.5, 39.5];
      map = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center,
        zoom: p && d ? 11 : 9,
      });

      if (p) new mapboxgl.Marker({ color: "#d4af37" }).setPopup(new mapboxgl.Popup().setText("Pickup")).setLngLat(p).addTo(map);
      if (d) new mapboxgl.Marker({ color: "#ef4444" }).setPopup(new mapboxgl.Popup().setText("Drop‑off")).setLngLat(d).addTo(map);

      if (p && d) {
        const bounds = new mapboxgl.LngLatBounds().extend(p).extend(d);
        map.fitBounds(bounds, { padding: 60, maxZoom: 13 });
      }
    })();

    return () => {
      map?.remove();
    };
  }, [token, pickup, dropoff]);

  return <div ref={ref} className={`h-80 w-full overflow-hidden rounded-2xl border border-border ${className}`} />;
}
