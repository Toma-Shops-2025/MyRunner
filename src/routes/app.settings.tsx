import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, ShieldOff, Star } from "lucide-react";
import { store } from "@/lib/local-store";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Account settings — MyRunner" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Settings,
});

function Settings() {
  const nav = useNavigate();
  const user = store.getUser();
  const [blocked, setBlocked] = useState<string[]>([]);
  const [preferred, setPreferred] = useState<string[]>([]);
  const [newBlock, setNewBlock] = useState("");
  const [newPref, setNewPref] = useState("");

  useEffect(() => {
    setBlocked(store.blockedDrivers());
    setPreferred(store.preferredDrivers());
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-4xl">Settings</h1>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl">Profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" defaultValue={user.name} />
          <Field label="Email" defaultValue={user.email} />
        </div>
        <Button className="mt-4 bg-gold text-primary-foreground hover:bg-gold/90" onClick={() => toast.success("Profile saved.")}>Save changes</Button>
      </section>

      {/* Preferred drivers */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <Star className="size-5 text-gold" />
          <h2 className="font-serif text-2xl">Preferred Runners</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Drivers you'd like to request first. They see a "Requested You" badge on your orders.</p>
        <div className="mt-4 flex gap-2">
          <Input value={newPref} onChange={(e) => setNewPref(e.target.value)} placeholder="Driver code (e.g. RUN‑8421)" />
          <Button
            onClick={() => {
              if (!newPref) return;
              const next = Array.from(new Set([...preferred, newPref.trim()]));
              store.setPreferredDrivers(next);
              setPreferred(next);
              setNewPref("");
              toast.success("Preferred Runner added.");
            }}
          >Add</Button>
        </div>
        {preferred.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {preferred.map((c) => (
              <li key={c} className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs">
                {c}
                <button
                  onClick={() => {
                    const next = preferred.filter((x) => x !== c);
                    store.setPreferredDrivers(next);
                    setPreferred(next);
                  }}
                  aria-label={`Remove ${c}`}
                >×</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Blocked drivers */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <ShieldOff className="size-5 text-destructive" />
          <h2 className="font-serif text-2xl">Blocked Runners</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">These drivers will never be matched to your orders.</p>
        <div className="mt-4 flex gap-2">
          <Input value={newBlock} onChange={(e) => setNewBlock(e.target.value)} placeholder="Driver code (e.g. RUN‑1234)" />
          <Button
            variant="destructive"
            onClick={() => {
              if (!newBlock) return;
              store.blockDriver(newBlock.trim());
              setBlocked(store.blockedDrivers());
              setNewBlock("");
              toast.success("Runner blocked.");
            }}
          >Block</Button>
        </div>
        {blocked.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {blocked.map((c) => (
              <li key={c} className="flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs">
                {c}
                <button
                  onClick={() => {
                    store.unblockDriver(c);
                    setBlocked(store.blockedDrivers());
                  }}
                  aria-label={`Unblock ${c}`}
                >×</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Delete account */}
      <section className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
        <div className="flex items-center gap-2">
          <Trash2 className="size-5 text-destructive" />
          <h2 className="font-serif text-2xl">Delete account</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Permanently delete your MyRunner account and all associated data within 30 days.
          Some records may be retained to comply with tax, fraud, safety, or legal obligations.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="mt-4">Delete my account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This is permanent. Your profile, order history, saved addresses,
                and preferences will be removed within 30 days. You can't undo this.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  store.wipeAll();
                  toast.success("Account deletion submitted.");
                  nav({ to: "/" });
                }}
              >Yes, delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input defaultValue={defaultValue} />
    </div>
  );
}
