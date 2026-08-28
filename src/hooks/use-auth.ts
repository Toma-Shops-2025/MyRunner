import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type Role = "customer" | "driver" | "admin";

const ALL_ROLES: Role[] = ["customer", "driver", "admin"];

async function fetchRoles(uid: string): Promise<Role[]> {
  const found = await Promise.all(
    ALL_ROLES.map(async (role) => {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: uid,
        _role: role,
      });
      if (error) return null;
      return data ? role : null;
    }),
  );
  const fromRpc = found.filter(Boolean) as Role[];
  if (fromRpc.length > 0) return fromRpc;

  const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
  return (data ?? []).map((r) => r.role as Role);
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setLoading(true);
        setTimeout(() => fetchRoles(s.user.id).then(setRoles).finally(() => setLoading(false)), 0);
      } else {
        setRoles([]);
        setLoading(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchRoles(data.session.user.id).then(setRoles).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return { session, user, roles, loading, isDriver: roles.includes("driver"), isAdmin: roles.includes("admin") };
}

export async function signOut() {
  await supabase.auth.signOut();
}
