import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, ShieldOff, Star, Share2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, signOut } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Account settings — MyRunner" }, { name: "robots", content: "noindex" }] }),
  component: Settings,
});

type Pref = { id: string; driver_id: string; preference: "blocked" | "preferred" };

function Settings() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [prefs, setPrefs] = useState<Pref[]>([]);
  const [newBlock, setNewBlock] = useState("");
  const [newPref, setNewPref] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name,phone").eq("id", user.id).single().then(({ data }) => {
      setName(data?.full_name ?? "");
      setPhone(data?.phone ?? "");
    });
    supabase.from("driver_preferences").select("id,driver_id,preference").then(({ data }) => setPrefs((data ?? []) as Pref[]));
  }, [user]);

  if (!user) return null;
  const blocked = prefs.filter((p) => p.preference === "blocked");
  const preferred = prefs.filter((p) => p.preference === "preferred");

  async function saveProfile() {
    const { error } = await supabase.from("profiles").update({ full_name: name, phone }).eq("id", user!.id);
    if (error) return toast.error(error.message);
    toast.success("Profile saved.");
  }

  async function addPref(driver_id: string, preference: "blocked" | "preferred") {
    if (!driver_id) return;
    const { data, error } = await supabase.from("driver_preferences").insert({ customer_id: user!.id, driver_id, preference }).select().single();
    if (error) return toast.error(error.message);
    setPrefs((p) => [...p, data as Pref]);
    if (preference === "blocked") setNewBlock(""); else setNewPref("");
    toast.success(preference === "blocked" ? "Runner blocked." : "Preferred Runner added.");
  }

  async function removePref(id: string) {
    const { error } = await supabase.from("driver_preferences").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setPrefs((p) => p.filter((x) => x.id !== id));
  }

  async function deleteAccount() {
    // Best-effort: wipe user-owned rows; final account deletion requires admin function.
    await supabase.from("driver_preferences").delete().eq("customer_id", user!.id);
    await supabase.from("reports").delete().eq("reporter_id", user!.id);
    await supabase.from("orders").delete().eq("customer_id", user!.id);
    await supabase.from("profiles").delete().eq("id", user!.id);
    await signOut();
    toast.success("Account deletion submitted. Final removal completes within 30 days.");
    nav({ to: "/" });
  }

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-4xl">Settings</h1>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl">Profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2"><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="grid gap-2"><Label>Email</Label><Input value={user.email ?? ""} disabled /></div>
          <div className="grid gap-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        </div>
        <Button className="mt-4 bg-gold text-primary-foreground hover:bg-gold/90" onClick={saveProfile}>Save changes</Button>
      </section>

      <section className="rounded-2xl border border-gold/40 bg-gold-soft p-6">
        <div className="flex items-center gap-2">
          <Share2 className="size-5 text-gold" />
          <h2 className="font-serif text-2xl">Share MyRunner</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Help friends discover on‑demand delivery. Grab your QR code and shareable link.
        </p>
        <Button asChild className="mt-4 bg-gold text-primary-foreground hover:bg-gold/90">
          <Link to="/share">Open share page</Link>
        </Button>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <Star className="size-5 text-gold" />
          <h2 className="font-serif text-2xl">Preferred Runners</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Drivers you'd like to request first.</p>
        <div className="mt-4 flex gap-2">
          <Input value={newPref} onChange={(e) => setNewPref(e.target.value)} placeholder="Driver user ID" />
          <Button onClick={() => addPref(newPref.trim(), "preferred")}>Add</Button>
        </div>
        {preferred.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {preferred.map((p) => (
              <li key={p.id} className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs">
                {p.driver_id.slice(0, 8)}
                <button onClick={() => removePref(p.id)} aria-label="Remove">×</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <ShieldOff className="size-5 text-destructive" />
          <h2 className="font-serif text-2xl">Blocked Runners</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">These drivers will never be matched to your orders.</p>
        <div className="mt-4 flex gap-2">
          <Input value={newBlock} onChange={(e) => setNewBlock(e.target.value)} placeholder="Driver user ID" />
          <Button variant="destructive" onClick={() => addPref(newBlock.trim(), "blocked")}>Block</Button>
        </div>
        {blocked.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {blocked.map((p) => (
              <li key={p.id} className="flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs">
                {p.driver_id.slice(0, 8)}
                <button onClick={() => removePref(p.id)} aria-label="Unblock">×</button>
              </li>
            ))}
          </ul>
        )}
      </section>

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
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={deleteAccount}>
                Yes, delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 pb-20">
        <h2 className="font-serif text-2xl mb-4">Legal & Support</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/privacy" className="p-4 rounded-xl border border-border bg-background text-sm font-medium hover:border-gold transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="p-4 rounded-xl border border-border bg-background text-sm font-medium hover:border-gold transition-colors">Terms of Service</Link>
          <Link to="/faq" className="p-4 rounded-xl border border-border bg-background text-sm font-medium hover:border-gold transition-colors">F.A.Q.</Link>
          <Link to="/contact" className="p-4 rounded-xl border border-border bg-background text-sm font-medium hover:border-gold transition-colors text-gold">Contact Support</Link>
        </div>
      </section>
    </div>
  );
}
