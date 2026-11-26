import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { fetchUserRoles } from "@/lib/auth-routing";

export type Role = "customer" | "driver" | "admin";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (!s?.user) {
        setRoles([]);
        setLoading(false);
        return;
      }
      // Resuming from camera/file picker fires TOKEN_REFRESHED — must not unmount long forms.
      const shouldRefreshRoles =
        event === "INITIAL_SESSION" ||
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "USER_UPDATED";
      if (!shouldRefreshRoles) return;
      setLoading(true);
      setTimeout(
        () =>
          fetchUserRoles(s.user.id, s.user.user_metadata as Record<string, unknown>)
            .then(setRoles)
            .finally(() => setLoading(false)),
        0,
      );
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchUserRoles(
          data.session.user.id,
          data.session.user.user_metadata as Record<string, unknown>,
        )
          .then(setRoles)
          .finally(() => setLoading(false));
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
