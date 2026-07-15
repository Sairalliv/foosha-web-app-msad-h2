// ── Supabase client ───────────────────────────────────────────────
//
// Initializes the Supabase JS client using the credentials in
// .env.local. Every other file that needs Supabase should import
// `supabase` from here — that keeps the init in one spot and makes
// key rotation a single-file change.
//
// The app's data layer (api.ts) currently reads/writes via localStorage
// (see localStore.ts). When you're ready to switch, swap the insides
// of the api.ts functions to use `supabase.from(...)` queries — the
// function signatures and return types stay the same.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Foosha] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing " +
    "from .env.local — the Supabase client will not be available. " +
    "The app will continue to run using the mock localStorage data layer. " +
    "See .env.example for the template."
  );
}

/**
 * The Supabase client instance, or `null` if the env vars are missing.
 * Check for `null` before using in api.ts to gracefully fall back to
 * the mock data layer.
 */
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
