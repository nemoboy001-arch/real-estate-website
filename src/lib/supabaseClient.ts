import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Checks if Supabase connection variables are configured in the environment.
 */
export const isSupabaseConfigured = (): boolean => {
  // If variables are placeholder or empty, consider unconfigured
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    supabaseUrl !== "placeholder" &&
    supabaseAnonKey !== "placeholder"
  );
};

export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
