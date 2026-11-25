import { orderedAddresses, parseRouteStops, type RouteStop } from "@/lib/route-stops";

export function RouteAddressList({
  pickup,
  dropoff,
  stops,
}: {
  pickup: string;
  dropoff: string;
  stops?: unknown;
}) {
  const parsed: RouteStop[] = Array.isArray(stops) ? parseRouteStops(stops) : [];
  const { pickups, dropoffs } = orderedAddresses(pickup, dropoff, parsed);
  return (
    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
      {pickups.map((address, index) => (
        <p key={`p-${index}`}>
          <span className="text-foreground/80">Pickup{pickups.length > 1 ? ` ${index + 1}` : ""}:</span> {address}
        </p>
      ))}
      {dropoffs.map((address, index) => (
        <p key={`d-${index}`}>
          <span className="text-foreground/80">Drop-off{dropoffs.length > 1 ? ` ${index + 1}` : ""}:</span> {address}
        </p>
      ))}
    </div>
  );
}
