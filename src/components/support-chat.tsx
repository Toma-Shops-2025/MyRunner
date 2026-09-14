import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { askSupportAssistant } from "@/lib/support.functions";
import { Button } from "@/components/ui/button";

type Msg = { role: "user" | "assistant"; content: string };

const STARTER: Msg = {
  role: "assistant",
  content:
    "Hi — I'm the MyRunner assistant. Ask about pricing, deliveries, becoming a Runner, refunds, or your recent orders if you're signed in.",
};

export function SupportChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([STARTER]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await askSupportAssistant({
        data: { messages: next.slice(-12) },
      });
      const reply = res?.reply || "Sorry — I couldn't answer that. Email support@myrunner.shop.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: msg.includes("GEMINI") || msg.includes("not configured")
            ? "AI support isn't configured on the server yet. Email support@myrunner.shop and we'll help."
            : `I hit a snag: ${msg}. You can also email support@myrunner.shop.`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div className="pointer-events-auto flex h-[min(70vh,520px)] w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <header className="flex items-center justify-between border-b border-border bg-background/80 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">Support</p>
              <p className="font-serif text-lg leading-tight">Ask MyRunner</p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              className="rounded-full p-2 text-muted-foreground hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              <X className="size-4" />
            </button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.role}`}
                className={`max-w-[90%] rounded-2xl px-3 py-2 ${
                  m.role === "user"
                    ? "ml-auto bg-gold text-primary-foreground"
                    : "bg-muted/60 text-foreground"
                }`}
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" /> Thinking…
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form
            className="flex gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gold"
              disabled={busy}
            />
            <Button
              type="submit"
              size="icon"
              disabled={busy || !input.trim()}
              className="shrink-0 bg-gold text-primary-foreground hover:bg-gold/90"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}
      <Button
        type="button"
        size="lg"
        className="pointer-events-auto h-14 rounded-full bg-gold px-5 text-primary-foreground shadow-lg hover:bg-gold/90"
        onClick={() => setOpen((v) => !v)}
      >
        <MessageCircle className="mr-2 size-5" />
        {open ? "Close" : "Help"}
      </Button>
    </div>
  );
}
