// Public catalogue: everything shown here comes from the Camwood admin panel (Supabase).
// Nothing is hard-coded: if no categories/products are published, the pages are simply empty.
(function(){
 const db=window.camwoodSupabase;
 const $=id=>document.getElementById(id);
 const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const empty=t=>'<p class="catalogue-empty">'+t+'</p>';

 async function loadCategories(){
  const grid=$("catalogueCategories"); if(!grid) return;
  if(!db){grid.innerHTML=empty("Collections are coming soon.");return}
  const {data,error}=await db.from("product_categories").select("id,name,slug,description").eq("is_published",true).order("sort_order").order("name");
  if(error){grid.innerHTML=empty("Collections could not be loaded. Please refresh.");return}
  const list=data||[];
  const count=$("categoryCount"); if(count) count.textContent=list.length?list.length+(list.length===1?" CATEGORY":" CATEGORIES"):"";
  grid.innerHTML=list.map((c,i)=>'<a class="category-card" href="collection.html?category='+encodeURIComponent(c.slug)+'"><span class="category-number">'+String(i+1).padStart(2,"0")+'</span><span class="category-icon">↗</span><div class="category-card-copy"><small>CAMWOOD COLLECTION</small><strong>'+safe(c.name)+'</strong><span>'+(c.description?safe(c.description):"Explore designs")+' <b>↗</b></span></div></a>').join("")||empty("Our collections are coming soon.");
 }

 async function loadProducts(){
  const grid=$("catalogueProducts"); if(!grid) return;
  const count=$("productCount"),title=$("collectionTitle"),crumb=$("collectionCrumb"),desc=$("collectionDescription");
  if(!db){grid.innerHTML=empty("Designs are coming soon.");return}
  const slug=new URLSearchParams(location.search).get("category")||"";
  let cat=null,q=db.from("products").select("*").eq("is_published",true).order("created_at",{ascending:false});
  if(slug){
   const r=await db.from("product_categories").select("id,name,description").eq("slug",slug).eq("is_published",true).maybeSingle();
   cat=r.data;
   if(!cat){grid.innerHTML=empty("This collection is not available yet.");if(count)count.textContent="0 designs";return}
   if(title)title.textContent=cat.name; if(crumb)crumb.textContent=cat.name.toUpperCase();
   if(desc&&cat.description)desc.textContent=cat.description;
   document.title=cat.name+" | Camwood";
   q=q.eq("category_id",cat.id);
  }else{
   if(title)title.textContent="All designs"; if(crumb)crumb.textContent="ALL DESIGNS";
  }
  const {data,error}=await q;
  if(error){grid.innerHTML=empty("Designs could not be loaded. Please refresh.");return}
  const products=data||[];
  if(count)count.textContent=products.length?products.length+(products.length===1?" design":" designs"):"";
  grid.innerHTML=products.map(p=>'<article class="catalogue-product-card"><button type="button" class="catalogue-product-open" data-product="'+safe(p.id)+'"><span class="catalogue-product-image">'+(p.images&&p.images[0]?'<img src="'+safe(p.images[0])+'" alt="'+safe(p.name)+'" loading="lazy" decoding="async">':'<span class="product-placeholder">CAMWOOD</span>')+'</span><span class="catalogue-product-meta"><small>'+safe(p.model_number||(cat&&cat.name)||"")+'</small><strong>'+safe(p.name)+'</strong><span>'+safe(p.price_label||"Enquire for price")+' ↗</span></span></button></article>').join("")||empty("No designs have been published here yet. Please check back soon.");

  const modal=$("productDetail"); if(!modal) return;
  modal.setAttribute("data-lenis-prevent","");
  const set=(id,v)=>{const el=$(id);if(el)el.textContent=v};
  grid.addEventListener("click",e=>{
   const btn=e.target.closest("[data-product]"); if(!btn) return;
   const p=products.find(x=>String(x.id)===btn.dataset.product); if(!p) return;
   set("detailTitle",p.name); set("detailModel",p.model_number||"");
   set("detailMaterial",p.material||"—"); set("detailDimensions",p.dimensions||"Confirm with Camwood");
   set("detailFinish",p.finish||"—"); set("detailPrice",p.price_label||"Enquire for price");
   const imgs=(p.images||[]).filter(Boolean),box=$("detailImage");
   box.innerHTML=imgs.length?'<img src="'+safe(imgs[0])+'" alt="'+safe(p.name)+'">'+(imgs.length>1?'<div class="detail-thumbs">'+imgs.map((u,i)=>'<button type="button" data-img="'+safe(u)+'" aria-label="Photo '+(i+1)+'"><img src="'+safe(u)+'" alt=""></button>').join("")+'</div>':""):'<div class="product-placeholder">CAMWOOD</div>';
   box.onclick=ev=>{const t=ev.target.closest("[data-img]");if(t){const main=box.querySelector(":scope > img");if(main)main.src=t.dataset.img}};
   const honesty=modal.querySelector(".detail-honesty"); if(honesty&&p.description)honesty.textContent=p.description;
   $("detailEnquire").href="contact.html?product="+encodeURIComponent(p.name);
   modal.hidden=false;
  });
  $("detailClose")?.addEventListener("click",()=>modal.hidden=true);
  modal.addEventListener("click",e=>{if(e.target===modal)modal.hidden=true});
  addEventListener("keydown",e=>{if(e.key==="Escape")modal.hidden=true});
 }
 loadCategories(); loadProducts();
})();
