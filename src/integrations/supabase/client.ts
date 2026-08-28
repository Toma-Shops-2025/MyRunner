import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

function createSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error("[Supabase] Browser client cannot be used during SSR.");
  }

  let url = import.meta.env.VITE_SUPABASE_URL || "";
  const key =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_API ||
    "";

  // AGGRESSIVE CLEANUP: Remove /rest/v1 or trailing slashes
  if (url) {
    url = url.split("/rest/v1")[0].replace(/\/$/, "");
  }

  if (!url || !key) {
    console.error("[Supabase] Missing keys. Check Netlify Env Vars.");
    return createClient<Database>("https://placeholder.supabase.co", "placeholder");
  }

  return createClient<Database>(url, key, {
    auth: {
      storage: window.localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

function getSupabaseClient() {
  if (!_supabase) _supabase = createSupabaseClient();
  return _supabase;
}

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    return Reflect.get(getSupabaseClient(), prop, receiver);
  },
});
