import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
function createSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error("[Supabase] Browser client cannot be used during SSR.");
  }
  {
    console.error("[Supabase] Missing keys. Check Netlify Env Vars.");
    return createClient("https://placeholder.supabase.co", "placeholder");
  }
}
let _supabase;
function getSupabaseClient() {
  if (!_supabase) _supabase = createSupabaseClient();
  return _supabase;
}
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    return Reflect.get(getSupabaseClient(), prop, receiver);
  }
});
export {
  supabase as s
};
