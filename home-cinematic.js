(function(){
 const root=document.querySelector('.cw-cinematic');
 const stage=root?.querySelector('.cw-sticky-stage');
 if(!root||!stage)return;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const door=stage.querySelector('.cw-door-panel');
 const doorway=stage.querySelector('.cw-doorway');
 const copy=stage.querySelector('.cw-stage-copy');
 const room=stage.querySelector('.cw-room');
 const outro=stage.querySelector('.cw-stage-outro');
 const caption=stage.querySelector('.cw-progress-number');
 const clamp=v=>Math.max(0,Math.min(1,v));
 const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
 const mobile=()=>window.innerWidth<=760;

 // A longer sticky runway gives the opening, camera move and interior reveal room to breathe.
 function setTrack(){root.style.setProperty('height',reduce?'100svh':(mobile()?'185svh':'420svh'),'important')}
 setTrack();

 // Atmosphere and a moving highlight stay decorative and never block interaction.
 if(!stage.querySelector('.cw-atmosphere')){
   const atmosphere=document.createElement('div');
   atmosphere.className='cw-atmosphere';atmosphere.setAttribute('aria-hidden','true');
   for(let i=0;i<18;i++){
     const dust=document.createElement('i');dust.className='cw-dust';
     dust.style.left=((i*47)%100)+'%';
     dust.style.setProperty('--duration',(9+(i%7)*1.7)+'s');
     dust.style.setProperty('--delay',(-i*1.15)+'s');
     atmosphere.appendChild(dust);
   }
   const glint=document.createElement('i');glint.className='cw-door-glint';atmosphere.appendChild(glint);
   stage.appendChild(atmosphere);
 }
 const scene=document.createElement('div');
 scene.className='cw-full-scene';scene.setAttribute('aria-hidden','true');
 scene.style.cssText="position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(90deg,#080d1d55,#080d1d22),url('page-03-image-396.webp') center/cover no-repeat;opacity:0;transform:scale(1.14);transition:opacity .18s linear";
 stage.prepend(scene);
 stage.style.isolation='isolate';

 let raf=0;
 function renderHero(){
   const rect=root.getBoundingClientRect();
   const runway=Math.max(1,root.offsetHeight-window.innerHeight);
   const progress=reduce?1:clamp(-rect.top/runway);
   // Door swing is the central interaction: camera approaches, then the door opens.
   const camera=smooth(progress/(mobile()?.22:.38));
   // On phones, a short swipe should complete the door opening; desktop keeps its longer cinematic pacing.
   const swing=mobile()?smooth((progress-.015)/.18):smooth((progress-.16)/.38);
   const reveal=mobile()?smooth((progress-.17)/.34):smooth((progress-.48)/.34);
   if(door)door.style.transform='rotateY('+(-swing*116)+'deg)';
   if(doorway){
     if(mobile())doorway.style.transform='translateX(-50%) translateY('+(camera*-5)+'vh) scale('+(1+camera*.24)+')';
     else doorway.style.transform='translate3d('+(camera*-7)+'vw,-50%,'+(camera*220)+'px) scale('+(1+camera*.25)+')';
   }
   if(room)room.style.filter='brightness('+(0.62+reveal*.48)+')';
   if(copy){
     const fade=smooth((progress-.20)/.18);
     copy.style.opacity=String(1-fade);
     copy.style.transform='translate3d(0,'+(-fade*34)+'px,0)';
   }
   scene.style.opacity=String(reveal);
   scene.style.transform='scale('+(1.14-reveal*.14)+')';
   if(outro){
     const show=smooth((progress-.82)/.15);
     outro.style.opacity=String(show);
     outro.style.transform='translateY('+(25-show*25)+'px)';
   }
   if(caption)caption.textContent=String(Math.round(progress*100)).padStart(2,'0')+'%';
   stage.style.setProperty('--cw-progress',String(progress));
   stage.style.setProperty('--cw-light',String(reveal));
   raf=0;
 }
 function request(){if(!raf)raf=requestAnimationFrame(renderHero)}
 window.addEventListener('scroll',request,{passive:true});
 window.addEventListener('resize',()=>{setTrack();request()});
 renderHero();

 // Staggered section entrances: every block animates once as it enters the viewport.
 const revealTargets=document.querySelectorAll(
   '.cw-story-image,.cw-story-copy,.cw-section-heading,.cw-product-tile,.cw-category-intro,.cw-category-card,.cw-why-art,.cw-why-copy,.cw-project-copy,.cw-project-photo,.intro-strip,.collections-teaser,.contact .section-kicker,.contact h2,.contact>p,.business-contact-card,.business-address-card'
 );
 revealTargets.forEach((el,i)=>{
   el.classList.add('cw-motion-reveal');
   el.style.setProperty('--cw-stagger',(i%6)*95+'ms');
   el.classList.add('cw-stagger-child');
 });
 if(reduce||!('IntersectionObserver'in window)){
   revealTargets.forEach(el=>el.classList.add('cw-in-view'));
 }else{
   const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
     if(entry.isIntersecting){entry.target.classList.add('cw-in-view');io.unobserve(entry.target)}
   }),{threshold:.12,rootMargin:'0px 0px -5% 0px'});
   revealTargets.forEach(el=>io.observe(el));
 }

 // Subtle image parallax is limited to visible media for mobile performance.
 const parallax=[...document.querySelectorAll('.cw-parallax-media')];
 function updateParallax(){
   if(!reduce)parallax.forEach(el=>{
     const rect=el.getBoundingClientRect();
     if(rect.bottom>-80&&rect.top<innerHeight+80){
       const center=(rect.top+rect.height/2-innerHeight/2)/innerHeight;
       const amount=Number(el.dataset.parallax||.1);
       el.style.transform='translate3d(0,'+(-center*48*amount*10)+'px,0) scale(1.06)';
     }
   });
 }
 let parallaxRaf=0;
 function requestParallax(){if(!parallaxRaf)parallaxRaf=requestAnimationFrame(()=>{updateParallax();parallaxRaf=0})}
 window.addEventListener('scroll',requestParallax,{passive:true});
 window.addEventListener('resize',requestParallax);
 updateParallax();

 // Horizontal product slider: buttons, touch/trackpad and keyboard all work.
 const rail=document.getElementById('cwProductRail');
 const prev=document.querySelector('.cw-rail-prev');
 const next=document.querySelector('.cw-rail-next');
 const count=document.querySelector('.cw-rail-count');
 const tiles=rail?[...rail.querySelectorAll('.cw-product-tile')]:[];
 function updateRail(){
   if(!rail||!tiles.length)return;
   const index=Math.min(tiles.length,Math.max(1,Math.round(rail.scrollLeft/Math.max(1,tiles[0].offsetWidth+18))+1));
   if(count)count.textContent=String(index).padStart(2,'0')+' — '+String(tiles.length).padStart(2,'0');
   if(prev)prev.disabled=rail.scrollLeft<=4;
   if(next)next.disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-4;
 }
 function moveRail(direction){
   if(!rail)return;
   rail.scrollBy({left:direction*Math.max(rail.clientWidth*.78,260),behavior:reduce?'auto':'smooth'});
 }
 prev?.addEventListener('click',()=>moveRail(-1));
 next?.addEventListener('click',()=>moveRail(1));
 rail?.addEventListener('scroll',updateRail,{passive:true});
 rail?.addEventListener('keydown',e=>{
   if(e.key==='ArrowRight'){e.preventDefault();moveRail(1)}
   if(e.key==='ArrowLeft'){e.preventDefault();moveRail(-1)}
 });
 updateRail();
})();