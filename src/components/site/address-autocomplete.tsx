import { useEffect, useRef, useState, type CSSProperties } from "react";
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
  onValueChange,
}: {
  name: string;
  id?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  onSelect?: (s: Suggestion) => void;
  onValueChange?: (value: string) => void;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [token, setToken] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({});
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const positionDropdown = () => {
    const input = inputRef.current;
    if (!input) return;
    const rect = input.getBoundingClientRect();
  const maxHeight = Math.min(220, Math.max(120, window.innerHeight - rect.bottom - 16));
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      maxHeight,
      zIndex: 60,
    });
  };

  const scrollFieldIntoView = () => {
    inputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  useEffect(() => {
    if (!open) return;
    positionDropdown();
    const onResize = () => positionDropdown();
    window.visualViewport?.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("scroll", onResize);
    window.addEventListener("resize", onResize);
    return () => {
      window.visualViewport?.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("scroll", onResize);
      window.removeEventListener("resize", onResize);
    };
  }, [open, suggestions.length]);

  return (
    <div ref={rootRef} className="relative isolate">
      <Input
        ref={inputRef}
        id={id}
        name={name}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onValueChange?.(e.target.value);
          setOpen(true);
          positionDropdown();
        }}
        onFocus={() => {
          scrollFieldIntoView();
          setOpen(true);
          positionDropdown();
        }}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        enterKeyHint="next"
        className="text-base md:text-base"
      />
      {open && suggestions.length > 0 && (
        <ul
          style={dropdownStyle}
          className="overflow-auto rounded-lg border border-border bg-card p-1 shadow-lg"
          role="listbox"
        >
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setValue(s.place_name);
                  setSuggestions([]);
                  setOpen(false);
                  onValueChange?.(s.place_name);
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