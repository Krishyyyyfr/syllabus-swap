import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = (
  import.meta.env.VITE_SUPABASE_URL ||
  "https://wevnmphlqlinsfqemnuh.supabase.co"
).replace(/\/$/, "");

const anonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indldm5tcGhscWxpbnNmcWVtbnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MzA2NzcsImV4cCI6MjEwNDEwNjY3N30.E-B1v1J6VSW4m3mAds4C1xNP5R-mshnsdJdYAXZm2ZM";

export const supabase = createClient(SUPABASE_URL, anonKey);
