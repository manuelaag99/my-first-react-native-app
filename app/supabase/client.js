import { createClient } from '@supabase/supabase-js'
import { API_KEY, API_URL } from "@env";

// Use a custom domain as the supabase URL
export const supabase = createClient(API_URL, API_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
});