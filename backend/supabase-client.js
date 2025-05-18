import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Regular client for normal operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Admin client for admin operations
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

export { supabase, supabaseAdmin };
