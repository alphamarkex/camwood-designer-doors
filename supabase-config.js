// Public client configuration only. Never put a Supabase service-role key in browser code.
window.CAMWOOD_SUPABASE_URL = "https://apwlblpynxxitofkvqdh.supabase.co";
window.CAMWOOD_SUPABASE_KEY = "sb_publishable_Pt_jbUlZ5vYNEKIqRguuvA_YLy1ai8l";
window.camwoodSupabase = window.supabase.createClient(window.CAMWOOD_SUPABASE_URL, window.CAMWOOD_SUPABASE_KEY);
