(function(){
 const db=window.camwoodSupabase;if(!db)return;
 const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const login='<p class="catalogue-empty">Please <a href="login.html">sign in</a> to browse the Camwood catalogue.</p>';
 async function session(){const {data:{session}}=await db.auth.getSession();return session}
 async function loadCategories(){
  const home=document.getElementById("homeCategories"),grid=document.getElementById("catalogueCategories");if(!home&&!grid)return;
  if(!(await session())){if(home)home.innerHTML=login;if(grid)grid.innerHTML=login;return}
  const {data,error}=await db.from("product_categories").select("id,name,slug,description").eq("is_published",true).order("sort_order").order("name");
  const html=error?'<p class="catalogue-empty">Catalogue could not be loaded. Please refresh.</p>':(data||[]).map((c,i)=>'<a class="'+(home?'cw-category-card':'category-card')+(home&&i===0?' cw-cat-wide':'')+'" href="collection.html?category='+encodeURIComponent(c.slug)+'"><span class="'+(home?'':'category-number')+'">'+String(i+1).padStart(2,'0')+'</span><span class="'+(home?'':'category-icon')+'">↗</span><div class="'+(home?'':'category-card-copy')+'"><small>CAMWOOD COLLECTION</small><strong>'+safe(c.name)+'</strong><span>Explore designs <b>↗</b></span></div></a>').join("")||'<p class="catalogue-empty">No collections published yet. Please check back soon.</p>';
  if(home)home.innerHTML=html;if(grid)grid.innerHTML=html;
 }
 async function loadProducts(){
  const grid=document.getElementById("catalogueProducts");if(!grid)return;
  const count=document.getElementById("productCount"),title=document.getElementById("collectionTitle"),crumb=document.getElementById("collectionCrumb");
  if(!(await session())){grid.innerHTML=login;if(count)count.textContent="Sign in required";return}
  const slug=new URLSearchParams(location.search).get("category")||"";
  let query=db.from("product_categories").select("id,name,description").eq("slug",slug).eq("is_published",true).maybeSingle();
  const {data:cat}=await query;
  if(!cat){grid.innerHTML='<p class="catalogue-empty">This collection is not available yet.</p>';if(count)count.textContent="0 products";return}
  if(title)title.textContent=cat.name;if(crumb)crumb.textContent=cat.name.toUpperCase();document.title=cat.name+" | Camwood";
  const {data,error}=await db.from("products").select("*").eq("category_id",cat.id).eq("is_published",true).order("created_at",{ascending:false});
  if(error){grid.innerHTML='<p class="catalogue-empty">Products could not be loaded. Please refresh.</p>';return}
  const products=data||[];if(count)count.textContent=products.length+" products";
  grid.innerHTML=products.map((p,i)=>'<article class="catalogue-product-card"><button type="button" class="catalogue-product-open" data-product="'+p.id+'"><span class="catalogue-product-image">'+(p.images?.[0]?'<img src="'+safe(p.images[0])+'" alt="'+safe(p.name)+'" loading="lazy">':'<span class="product-placeholder">CAMWOOD</span>')+'</span><span class="catalogue-product-meta"><small>'+safe(p.model_number||cat.name)+'</small><strong>'+safe(p.name)+'</strong><span>'+safe(p.price_label||"Enquire for price")+'　↗</span></span></button></article>').join("")||'<p class="catalogue-empty">No products have been published in this collection yet.</p>';
  const modal=document.getElementById("productDetail");
  grid.addEventListener("click",e=>{const btn=e.target.closest("[data-product]");if(!btn)return;const p=products.find(x=>x.id===btn.dataset.product);if(!p||!modal)return;
   document.getElementById("detailTitle").textContent=p.name;document.getElementById("detailModel").textContent=p.model_number||"";document.getElementById("detailMaterial").textContent=p.material||"—";document.getElementById("detailDimensions").textContent=p.dimensions||"Confirm with Camwood";document.getElementById("detailFinish").textContent=p.finish||"—";document.getElementById("detailPrice").textContent=p.price_label||"Enquire for price";
   const image=document.getElementById("detailImage");image.innerHTML=p.images?.[0]?'<img src="'+safe(p.images[0])+'" alt="'+safe(p.name)+'">':'<div class="product-placeholder">CAMWOOD</div>';
   const enquire=document.getElementById("detailEnquire");enquire.href="contact.html?product="+encodeURIComponent(p.name);modal.hidden=false;
  });
  document.getElementById("detailClose")?.addEventListener("click",()=>modal.hidden=true);modal?.addEventListener("click",e=>{if(e.target===modal)modal.hidden=true});
 }
 loadCategories();loadProducts();
})();