import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lquujuqfbzxgiouesrzw.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdXVqdXFmYnp4Z2lvdWVzcnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MDEwNDMsImV4cCI6MjA5NTM3NzA0M30.RnSl7-ChvUQzGZYLFjLUDKMba5eDNj4c50p-5XJW9Vw";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);