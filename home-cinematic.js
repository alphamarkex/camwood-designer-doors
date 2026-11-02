(function(){
 const root=document.querySelector('.cw-cinematic'),stage=root?.querySelector('.cw-sticky-stage');
 if(!root||!stage)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>{v=clamp(v);return v*v*(3-2*v)};
 const items=[
  ['MEMBRANE DOORS','Warm textures. Timeless character.','page-03-image-395.webp'],
  ['TEXTURED DOORS','Sculpted surfaces and expressive detail.','page-09-image-6914.webp'],
  ['DOUBLE DOORS','A grand welcome with balanced symmetry.','page-12-image-11313.webp'],
  ['DIGITAL DOORS','Contemporary design for modern spaces.','page-14-image-12887.webp'],
  ['WOODEN WINDOWS','Natural light, framed beautifully.','page-18-image-15887.webp'],
  ['JALI DOORS','Intricate patterns and crafted character.','page-18-image-16870.webp']
 ];
 stage.querySelectorAll('.cw-web-experience,.cw-showroom-walkway,.cw-showroom-chapter,.cw-showroom-progress,.cw-atmosphere,.cw-door-glint,.cw-doorway,.cw-stage-copy,.cw-vignette,.cw-grain,.cw-stage-caption,.cw-tour-scroll-hint,.cw-stage-outro').forEach(el=>el.remove());
 const keys=['Q W E R T Y U I O P','A S D F G H J K L','⇧ Z X C V B N M ↵','⌘　ALT　　 SPACE　　 ALT　⌘'];
 const productCards=items.map((v,i)=>'<article class="cw-laptop-product"><img src="'+v[2]+'" alt="'+v[0]+'"><small>0'+(i+1)+' / CAMWOOD COLLECTION</small><strong>'+v[0]+'</strong><span>'+v[1]+'</span></article>').join('');
 const ex=document.createElement('div');ex.className='cw-web-experience';
 ex.innerHTML='<div class="cw-studio-light"></div><div class="cw-laptop-wrap"><div class="cw-laptop-screen"><div class="cw-screen-bezel"><div class="cw-camera-dot"></div><div class="cw-screen-inner"><div class="cw-site-nav"><b>cam<span>wood</span></b><div>HOME　 COLLECTIONS　 ABOUT　 CONTACT</div><i>EXPLORE ↗</i></div><div class="cw-screen-viewport"><div class="cw-screen-page"><section class="cw-site-hero"><div class="cw-site-hero-copy"><small>DESIGNER DOORS & WINDOWS · VARANASI</small><h2>Make an entrance<br>that <em>stays with you.</em></h2><p>Thoughtful doors, distinctive finishes and details that make every space feel considered.</p><b>DISCOVER CAMWOOD　↗</b></div><div class="cw-site-hero-photo"><img src="page-03-image-395.webp" alt="Camwood designer door"></div></section><section class="cw-site-collections"><header><small>THE CAMWOOD COLLECTIONS</small><h3>Find your <em>signature.</em></h3><p>Distinctive designs for every kind of space.</p></header><div class="cw-laptop-products">'+productCards+'</div></section><section class="cw-site-feature"><img src="page-03-image-396.webp" alt="Camwood interior door"><div><small>MADE FOR REAL SPACES</small><h3>Details that<br><em>feel like you.</em></h3><p>Explore textures, warm finishes and modern patterns from the Camwood portfolio.</p></div></section><section class="cw-site-end"><small>LET’S FIND YOUR DOOR</small><h3>Every great space<br>starts with an <em>opening.</em></h3><b>VISIT OUR SHOWROOM　↗</b></section></div></div><div class="cw-site-footer"><span>CAMWOOD / DESIGNER DOORS & WINDOWS</span><b class="cw-frame-counter">01 / 04</b></div></div></div><div class="cw-laptop-hinge"></div><div class="cw-laptop-base"><div class="cw-keyboard">'+keys.map(row=>'<div class="cw-key-row">'+row.split(' ').map(k=>'<i>'+k+'</i>').join('')+'</div>').join('')+'</div><div class="cw-trackpad"></div></div></div><div class="cw-reference-caption"><small>CAMWOOD · A DIGITAL SHOWROOM EXPERIENCE</small><strong>Designed to make an entrance.</strong><span>SCROLL TO EXPLORE　↓</span></div>';
 stage.appendChild(ex);
 root.style.height=reduce?'100svh':'760vh';
 const frame=ex.querySelector('.cw-laptop-wrap'),page=ex.querySelector('.cw-screen-page'),viewport=ex.querySelector('.cw-screen-viewport'),counter=ex.querySelector('.cw-frame-counter');
 let raf=0,now=0,target=0;
 function draw(){
  const rect=root.getBoundingClientRect(),range=Math.max(1,root.offsetHeight-innerHeight);
  target=reduce?0:clamp(-rect.top/range);
  now+=(target-now)*(reduce?.9:.2);if(Math.abs(target-now)<.00045)now=target;
  const p=now,scrollable=Math.max(0,page.scrollHeight-viewport.clientHeight);
  page.style.transform='translate3d(0,'+(-scrollable*ease((p-.025)/.91))+'px,0)';
  // Keep the studio and laptop composition stable; only a restrained camera drift.
  frame.style.transform='translate3d(0,'+(-10+Math.sin(p*Math.PI*2)*5)+'px,0) rotateX('+(8-p*2)+'deg) rotateY('+(p*1.2-1.8)+'deg) scale('+(1+p*.035)+')';
  ex.style.setProperty('--studio-glow',String(.6+Math.sin(p*Math.PI)*.12));
  counter.textContent=String(Math.min(4,Math.floor(p*4)+1)).padStart(2,'0')+' / 04';
  const cap=ex.querySelector('.cw-reference-caption');cap.style.opacity=String(1-ease((p-.84)/.13));
  if(Math.abs(target-now)>.00045)raf=requestAnimationFrame(draw);else raf=0;
 }
 function request(){if(!raf)raf=requestAnimationFrame(draw)}
 addEventListener('scroll',request,{passive:true});addEventListener('resize',request);draw();
 const reveals=document.querySelectorAll('.cw-category-card,.product-card,.latest-content,.feature-copy,.feature-image,.teaser-copy,.contact .section-kicker,.contact h2,.contact>p,.business-contact-card,.business-address-card');
 if(reduce||!('IntersectionObserver'in window))reveals.forEach(e=>e.classList.add('cw-in-view'));
 else{const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('cw-in-view');io.unobserve(e.target)}}),{threshold:.12});reveals.forEach(e=>{e.classList.add('cw-motion-reveal');io.observe(e)})}
})();