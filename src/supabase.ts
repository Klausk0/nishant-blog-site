import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mmussjhpiipkozwphmvr.supabase.co";
const supabaseKey = "sb_publishable_MNBE_W9S76yXsj7cNLHz3g_yZRbx8lo";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);