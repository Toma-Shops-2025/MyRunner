import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
function createSupabaseClient() {
  let url = "https://ansjbzszrfkaajlfiukv.supabase.co";
  const key = "sb_publishable_I-uZz8zZnwfSoKgDlWKPGw_1dI3D5qC";
  if (url) {
    url = url.split("/rest/v1")[0].replace(/\/$/, "");
  }
  if (!url || !key) {
    console.error("[Supabase] Missing keys. Check Netlify Env Vars.");
    return createClient("https://placeholder.supabase.co", "placeholder");
  }
  return createClient(url, key, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
export {
  supabase as s
};
