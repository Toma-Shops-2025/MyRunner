import { r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-DfLBq1uk.mjs";
import { i as intentFromMetadata } from "./signup-intent-DuoHB-mj.mjs";
function applyCustomerGuard(roles, signupIntent, approvedApp, completedDriverSetup) {
  if (signupIntent === "customer" && !approvedApp && !completedDriverSetup) {
    roles.delete("driver");
  }
}
async function fetchUserRoles(uid, metadata) {
  const signupIntent = intentFromMetadata(metadata);
  const allRoles = ["customer", "driver", "admin"];
  const found = await Promise.all(
    allRoles.map(async (role) => {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: uid,
        _role: role
      });
      if (error) return null;
      return data ? role : null;
    })
  );
  const roles = new Set(found.filter(Boolean));
  if (roles.size === 0) {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    for (const row of data ?? []) roles.add(row.role);
  }
  let approvedApp = false;
  let completedDriverSetup = false;
  const [{ data: app }, { data: profile }] = await Promise.all([
    supabase.from("driver_applications").select("status").eq("user_id", uid).maybeSingle(),
    supabase.from("profiles").select("stripe_connect_account_id, payouts_enabled").eq("id", uid).maybeSingle()
  ]);
  if (app?.status === "approved") {
    approvedApp = true;
    roles.add("driver");
  }
  if (profile?.stripe_connect_account_id && profile?.payouts_enabled) {
    completedDriverSetup = true;
    roles.add("driver");
  }
  applyCustomerGuard(roles, signupIntent, approvedApp, completedDriverSetup);
  return [...roles];
}
async function resolveClientPostAuthDestination(userId, metadata) {
  const roles = await fetchUserRoles(userId, metadata);
  if (roles.includes("admin")) return "/admin/dashboard";
  if (roles.includes("driver")) return "/driver/dashboard";
  return "/app/dashboard";
}
function notifyPayoutStatusChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("myrunner:payout-refresh"));
  }
}
function useAuth() {
  const [session, setSession] = reactExports.useState(null);
  const [user, setUser] = reactExports.useState(null);
  const [roles, setRoles] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setLoading(true);
        setTimeout(
          () => fetchUserRoles(s.user.id, s.user.user_metadata).then(setRoles).finally(() => setLoading(false)),
          0
        );
      } else {
        setRoles([]);
        setLoading(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchUserRoles(
          data.session.user.id,
          data.session.user.user_metadata
        ).then(setRoles).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  return { session, user, roles, loading, isDriver: roles.includes("driver"), isAdmin: roles.includes("admin") };
}
async function signOut() {
  await supabase.auth.signOut();
}
export {
  notifyPayoutStatusChanged as n,
  resolveClientPostAuthDestination as r,
  signOut as s,
  useAuth as u
};
