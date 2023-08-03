import { createClient } from '@supabase/supabase-js'

// Use a custom domain as the supabase URL
export const supabase = createClient("https://xhqweqpllhpxnnppikti.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdlcXBsbGhweG5ucHBpa3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA5MzcxOTMsImV4cCI6MjAwNjUxMzE5M30.-4qbLEaPf41hynHqNWrjKQx2WKT1r4RblifURWc3I9k");