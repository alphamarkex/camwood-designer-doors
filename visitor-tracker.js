(async function(){
 const db=window.camwoodSupabase;if(!db)return;
 const {data:{session}}=await db.auth.getSession();if(!session)return;
 const path=location.pathname+location.search;
 const sessionKey="camwood_session_id";
 let sid=sessionStorage.getItem(sessionKey);if(!sid){sid=crypto.randomUUID();sessionStorage.setItem(sessionKey,sid)}
 await db.from("website_events").insert({user_id:session.user.id,event_type:"page_view",page_path:path,session_id:sid,referrer:document.referrer||""});
 document.addEventListener("click",async e=>{
  const target=e.target.closest("[data-product-id]");
  if(target) await db.from("website_events").insert({user_id:session.user.id,event_type:"product_view",page_path:path,product_id:target.dataset.productId,session_id:sid,referrer:document.referrer||""});
 });
})();