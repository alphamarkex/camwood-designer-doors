(async function(){
  const client = window.camwoodSupabase;
  if (!client) return;
  const path = location.pathname.split("/").pop() || "index.html";
  const publicPages = new Set(["login.html"]);
  if (publicPages.has(path)) return;
  const { data: { session } } = await client.auth.getSession();
  if (!session) {
    location.replace("login.html?next=" + encodeURIComponent(location.pathname + location.search));
    return;
  }
  if (path === "admin.html") {
    const { data: admin, error } = await client.from("admin_users").select("user_id").eq("user_id", session.user.id).maybeSingle();
    if (error || !admin) location.replace("index.html?admin=denied");
  }
})();
