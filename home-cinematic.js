(function(){
  const root=document.querySelector('.cw-cinematic');
  const stage=root?.querySelector('.cw-sticky-stage');
  if(!root||!stage)return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp=v=>Math.max(0,Math.min(1,v));
  const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
  const collections=[
    ['MEMBRANE DOORS','Warm textures. Timeless character.','page-03-image-395.webp'],
    ['TEXTURED DOORS','Sculpted surfaces and expressive detail.','page-09-image-6914.webp'],
    ['DOUBLE DOORS','A grand welcome with balanced symmetry.','page-12-image-11313.webp'],
    ['DIGITAL DOORS','Contemporary design for modern spaces.','page-14-image-12887.webp'],
    ['WOODEN WINDOWS','Natural light, framed beautifully.','page-18-image-15887.webp'],
    ['JALI DOORS','Intricate patterns and crafted character.','page-18-image-16870.webp']
  ];
  stage.querySelectorAll('.cw-showroom-walkway,.cw-showroom-chapter,.cw-showroom-progress,.cw-atmosphere,.cw-door-glint').forEach(el=>el.remove());
  const oldDoor=stage.querySelector('.cw-doorway'); if(oldDoor)oldDoor.remove();
  const oldCopy=stage.querySelector('.cw-stage-copy'); if(oldCopy)oldCopy.remove();
  stage.querySelectorAll('.cw-vignette,.cw-grain,.cw-stage-caption,.cw-tour-scroll-hint,.cw-stage-outro').forEach(el=>el.remove());
  const experience=document.createElement('div');experience.className='cw-web-experience';
  experience.innerHTML='<div class="cw-neon-floor"></div><div class="cw-screen-shadow"></div><div class="cw-browser-frame"><div class="cw-browser-top"><span class="cw-browser-brand">cam<span>wood</span></span><div class="cw-browser-links"><i>HOME</i><i>COLLECTIONS</i><i>ABOUT</i><i>CONTACT</i></div><b>EXPLORE ↗</b></div><div class="cw-browser-viewport"><div class="cw-browser-page"><section class="cw-browser-hero"><div class="cw-browser-hero-copy"><small>DESIGNER DOORS & WINDOWS · VARANASI</small><h2>Make an<br>entrance that<br><em>stays with you.</em></h2><p>Thoughtful doors, distinctive finishes and details that make every space feel considered.</p><span>DISCOVER CAMWOOD　↗</span></div><div class="cw-browser-hero-image"><img src="page-03-image-395.webp" alt="Camwood wooden designer door"></div></section><section class="cw-browser-collection"><div class="cw-browser-section-head"><small>THE CAMWOOD EDIT</small><h3>Find your <em>signature.</em></h3><p>Explore doors made to define your space.</p></div><div class="cw-browser-products">'+collections.map((x,i)=>'<article class="cw-browser-product"><img src="'+x[2]+'" alt="'+x[0]+'"><small>0'+(i+1)+' / CAMWOOD</small><b>'+x[0]+'</b></article>').join('')+'</div></section><section class="cw-browser-end"><small>THE DETAILS MAKE THE DIFFERENCE</small><h3>Open up to<br><em>something beautiful.</em></h3><span>VISIT THE CAMWOOD SHOWROOM　↗</span></section></div></div><div class="cw-browser-bottom"><span>CAMWOOD / DESIGNER DOORS & WINDOWS</span><b class="cw-screen-count">01 — 04</b></div></div><div class="cw-experience-caption"><small>THE CAMWOOD DIGITAL SHOWROOM</small><strong>Explore beyond the ordinary.</strong><span>SCROLL TO EXPLORE ↓</span></div>';
  stage.appendChild(experience);
  root.style.height=reduce?'100svh':'720vh';
  const frame=experience.querySelector('.cw-browser-frame');
  const page=experience.querySelector('.cw-browser-page');
  const count=experience.querySelector('.cw-screen-count');
  let raf=0,progress=0,target=0;
  function render(){
    const rect=root.getBoundingClientRect(),travel=Math.max(1,root.offsetHeight-innerHeight);
    target=reduce?0:clamp(-rect.top/travel);
    progress+=(target-progress)*(reduce?1:.19);
    if(Math.abs(target-progress)<.0005)progress=target;
    const p=progress;
    const pageTravel=Math.max(0,page.scrollHeight-experience.querySelector('.cw-browser-viewport').clientHeight);
    page.style.transform='translate3d(0,'+(-pageTravel*smooth((p-.08)/.72))+'px,0)';
    const zoom=1+smooth(p)*.34;
    const tilt=10-(smooth(p)*8);
    const lift=30+smooth(p)*95;
    frame.style.transform='translate3d(0,'+(-lift*smooth(p))+'px,0) rotateX('+tilt+'deg) rotateY('+(-4+Math.sin(p*Math.PI)*2)+'deg) scale('+zoom+')';
    frame.style.filter='brightness('+(0.78+smooth(p)*.22)+')';
    experience.style.setProperty('--cw-glow',String(.35+smooth(p)*.65));
    count.textContent=String(Math.min(4,Math.floor(p*4)+1)).padStart(2,'0')+' — 04';
    const caption=experience.querySelector('.cw-experience-caption');
    caption.style.opacity=String(1-clamp((p-.78)/.17));
    if(Math.abs(target-progress)>.0005)raf=requestAnimationFrame(render);else raf=0;
  }
  function request(){if(!raf)raf=requestAnimationFrame(render)}
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',request);
  render();
  const revealTargets=document.querySelectorAll('.cw-category-card,.product-card,.latest-content,.feature-copy,.feature-image,.teaser-copy,.contact .section-kicker,.contact h2,.contact>p,.business-contact-card,.business-address-card');
  if(reduce||!('IntersectionObserver'in window)){revealTargets.forEach(el=>el.classList.add('cw-in-view'));}
  else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('cw-in-view');observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -7% 0px'});revealTargets.forEach(el=>{el.classList.add('cw-motion-reveal');observer.observe(el);});}
})();