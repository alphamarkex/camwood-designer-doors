(function () {
  const CONSENT_KEY = "camwood_analytics_consent";
  const VISITOR_COOKIE = "camwood_visitor_id";
  const ENDPOINT = "https://apwlblpynxxitofkvqdh.supabase.co/functions/v1/capture-website-event";

  function readCookie(name) {
    const prefix = name + "=";
    const item = document.cookie.split("; ").find((part) => part.startsWith(prefix));
    return item ? decodeURIComponent(item.slice(prefix.length)) : "";
  }
  function writeCookie(name, value, days) {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = name + "=" + encodeURIComponent(value) + "; Max-Age=" + maxAge + "; Path=/; SameSite=Lax; Secure";
  }
  function uuid() {
    return crypto.randomUUID();
  }
  function injectConsentBanner() {
    if (document.getElementById("cw-cookie-banner")) return;
    const style = document.createElement("style");
    style.textContent = "#cw-cookie-banner{position:fixed;z-index:99990;left:16px;right:16px;bottom:16px;max-width:720px;margin:auto;background:#fff;color:#1d2933;border:1px solid #dce3e8;border-radius:14px;padding:18px;box-shadow:0 12px 44px #0002;font:14px/1.5 Arial,sans-serif;display:flex;gap:16px;align-items:center;justify-content:space-between}#cw-cookie-banner p{margin:0;flex:1}#cw-cookie-banner .cw-cookie-actions{display:flex;gap:8px;flex-wrap:wrap}#cw-cookie-banner button{border:1px solid #174d70;border-radius:8px;padding:9px 12px;font-weight:700;cursor:pointer}#cw-cookie-accept{background:#174d70;color:#fff}#cw-cookie-reject{background:#fff;color:#174d70}@media(max-width:560px){#cw-cookie-banner{display:block}#cw-cookie-banner p{margin-bottom:12px}#cw-cookie-banner .cw-cookie-actions{justify-content:flex-start}}";
    document.head.appendChild(style);
    const banner = document.createElement("aside");
    banner.id = "cw-cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Analytics cookie choices");
    banner.innerHTML = '<p><strong>Your privacy matters.</strong> Camwood can use an anonymous cookie to understand page visits and improve the website. Analytics cookies are optional and do not reveal your name or phone number.</p><div class="cw-cookie-actions"><button id="cw-cookie-accept" type="button">Accept analytics</button><button id="cw-cookie-reject" type="button">Reject</button></div>';
    document.body.appendChild(banner);
    document.getElementById("cw-cookie-accept").addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "accepted");
      banner.remove();
      startTracking();
    });
    document.getElementById("cw-cookie-reject").addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "rejected");
      banner.remove();
    });
  }
  async function record(eventType) {
    const visitorId = readCookie(VISITOR_COOKIE);
    let sessionId = sessionStorage.getItem("camwood_analytics_session");
    if (!sessionId) {
      sessionId = uuid();
      sessionStorage.setItem("camwood_analytics_session", sessionId);
    }
    try {
      await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitor_id: visitorId,
          session_id: sessionId,
          event_type: eventType || "page_view",
          page_path: location.pathname + location.search,
          referrer: document.referrer || ""
        }),
        keepalive: true
      });
    } catch (_) {
      // Analytics is non-essential; never block browsing if it fails.
    }
  }
  function startTracking() {
    let visitorId = readCookie(VISITOR_COOKIE);
    if (!visitorId) {
      visitorId = uuid();
      writeCookie(VISITOR_COOKIE, visitorId, 180);
    }
    record("page_view");
  }
  function init() {
    const choice = localStorage.getItem(CONSENT_KEY);
    if (choice === "accepted") {
      startTracking();
    } else if (choice !== "rejected") {
      injectConsentBanner();
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();