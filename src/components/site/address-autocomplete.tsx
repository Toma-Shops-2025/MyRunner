import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { getPublicConfig } from "@/lib/config.functions";

type Suggestion = { id: string; place_name: string; center: [number, number] };

export function AddressAutocomplete({
  name,
  id,
  placeholder,
  defaultValue,
  required,
  onSelect,
}: {
  name: string;
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  onSelect?: (s: Suggestion) => void;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [token, setToken] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getPublicConfig().then((c) => setToken(c.mapboxToken));
  }, []);

  useEffect(() => {
    if (!token || value.length < 3) {
      setSuggestions([]);
      return;
    }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        value,
      )}.json?access_token=${token}&autocomplete=true&limit=5&country=us`;
      try {
        const r = await fetch(url);
        const j = (await r.json()) as { features: Suggestion[] };
        setSuggestions(j.features ?? []);
      } catch {
        setSuggestions([]);
      }
    }, 250);
  }, [value, token]);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-border bg-popover p-1 shadow-lg">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  setValue(s.place_name);
                  setSuggestions([]);
                  setOpen(false);
                  onSelect?.(s);
                }}
                className="w-full rounded px-3 py-2 text-left text-sm hover:bg-accent"
              >
                {s.place_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
