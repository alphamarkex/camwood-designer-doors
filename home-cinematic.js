(function(){
 const root=document.querySelector('.cw-cinematic'),stage=root?.querySelector('.cw-sticky-stage');
 if(!root||!stage)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const door=stage.querySelector('.cw-door-panel'),doorway=stage.querySelector('.cw-doorway');
 const copy=stage.querySelector('.cw-stage-copy'),room=stage.querySelector('.cw-room');
 const outro=stage.querySelector('.cw-stage-outro'),caption=stage.querySelector('.cw-progress-number');
 const clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>{v=clamp(v);return v*v*(3-2*v)};
 // A single short swipe should complete the door-opening beat, including on phones.
 function setTrack(){root.style.setProperty('height',reduce?'100svh':(innerWidth<=760?'115svh':'125vh'),'important')}
 setTrack();
 const scene=document.createElement('div');scene.className='cw-full-scene';scene.setAttribute('aria-hidden','true');
 scene.style.cssText="position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(90deg,#080a0e55,#080a0e22),url('page-03-image-396.webp') center/cover no-repeat;opacity:0;transform:scale(1.12);transition:opacity .18s linear";
 stage.prepend(scene);
 stage.style.setProperty('isolation','isolate');
 let raf=0;
 function render(){
  const rect=root.getBoundingClientRect();
  // Map the first ~10% of a viewport of movement to the complete cinematic transition.
  const travel=Math.max(90,innerHeight*.12);
  const p=reduce?1:clamp(-rect.top/travel),e=ease(p);
  if(door)door.style.transform='rotateY('+(-e*116)+'deg)';
  if(doorway)doorway.style.transform=innerWidth<=760?'translateX(-50%) scale('+(1+e*.13)+')':'translate3d('+(e*-5)+'vw,-50%,'+(e*100)+'px) scale('+(1+e*.12)+')';
  if(room)room.style.filter='brightness('+(0.58+e*.58)+')';
  if(copy){copy.style.opacity=String(1-e);copy.style.transform='translate3d(0,'+(-e*40)+'px,0)'}
  // As the door swings open, the entire stage changes into the interior photograph.
  const reveal=clamp((p-.24)/.48);
  scene.style.opacity=String(reveal);
  scene.style.transform='scale('+(1.12-reveal*.12)+')';
  stage.style.backgroundColor='#080a0e';
  if(outro){const o=clamp((p-.72)/.2);outro.style.opacity=String(o);outro.style.transform='translateY('+(24-o*24)+'px)'}
  if(caption)caption.textContent=String(Math.round(p*100)).padStart(2,'0')+'%';
  raf=0;
 }
 function request(){if(!raf)raf=requestAnimationFrame(render)}
 addEventListener('scroll',request,{passive:true});addEventListener('resize',()=>{setTrack();request()});render();
 const reveals=document.querySelectorAll('.cw-category-card,.teaser-copy,.contact .section-kicker,.contact h2,.contact>p,.business-contact-card,.business-address-card');
 if(reduce||!('IntersectionObserver'in window))reveals.forEach(e=>e.classList.add('cw-in-view'));
 else{const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('cw-in-view');io.unobserve(e.target)}}),{threshold:.12});reveals.forEach(e=>{e.classList.add('cw-motion-reveal');io.observe(e)})}
})();