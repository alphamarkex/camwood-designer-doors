// Public catalogue pages are browsable without sign-in. Protect only the admin panel.
(async function(){
  const path = location.pathname.split("/").pop() || "index.html";
  if (path !== "admin.html") return;
  const client = window.camwoodSupabase;
  if (!client) { location.replace("login.html?next=" + encodeURIComponent(location.pathname + location.search)); return; }
  const { data: { session } } = await client.auth.getSession();
  if (!session) { location.replace("login.html?next=" + encodeURIComponent(location.pathname + location.search)); return; }
  const { data: admin, error } = await client.from("admin_users").select("user_id").eq("user_id", session.user.id).maybeSingle();
  if (error || !admin) location.replace("index.html?admin=denied");
})();