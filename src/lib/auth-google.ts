import { supabase } from "@/integrations/supabase/client";

/** Shared Google OAuth entry — returns to /auth/callback then routes by role. */
export async function signInWithGoogle(redirectPath = "/auth/callback") {
  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}${redirectPath}`
      : `https://myrunner.shop${redirectPath}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });

  return { data, error };
}
