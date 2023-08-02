import { createClient } from '@supabase/supabase-js'

// Use a custom domain as the supabase URL
export const supabase = createClient(import.meta.env.VITE_APP_SUPABASE_URL, import.meta.env.VITE_APP_SUPABASE_ANON_KEY);