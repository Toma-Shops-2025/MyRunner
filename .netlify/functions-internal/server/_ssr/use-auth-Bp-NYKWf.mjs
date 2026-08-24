import { r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-CbrcWund.mjs";
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
        setTimeout(() => loadRoles(s.user.id).finally(() => setLoading(false)), 0);
      } else {
        setRoles([]);
        setLoading(false);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        loadRoles(data.session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  async function loadRoles(uid) {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    setRoles((data ?? []).map((r) => r.role));
  }
  return { session, user, roles, loading, isDriver: roles.includes("driver"), isAdmin: roles.includes("admin") };
}
async function signOut() {
  await supabase.auth.signOut();
}
export {
  signOut as s,
  useAuth as u
};
