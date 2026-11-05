(function(){
 const root=document.querySelector('.cw-cinematic'),stage=root?.querySelector('.cw-sticky-stage');
 if(!root||!stage)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const track=root.querySelector('.cw-scroll-track');
 const door=stage.querySelector('.cw-door-panel');
 const doorway=stage.querySelector('.cw-doorway');
 const copy=stage.querySelector('.cw-stage-copy');
 const room=stage.querySelector('.cw-room');
 const outro=stage.querySelector('.cw-stage-outro');
 const caption=stage.querySelector('.cw-progress-number');
 const clamp=v=>Math.max(0,Math.min(1,v));
 let raf=0;
 function render(){
  const rect=root.getBoundingClientRect(),range=Math.max(1,root.offsetHeight-innerHeight);
  const p=reduce?0:clamp(-rect.top/range),ease=p*p*(3-2*p);
  if(door)door.style.transform='rotateY('+(-ease*112)+'deg)';
  if(doorway)doorway.style.transform=window.innerWidth<=760?'translateX(-50%) scale('+(1+ease*.08)+')':'translate3d('+(ease*-5)+'vw,-50%,'+(ease*70)+'px) scale('+(1+ease*.1)+')';
  if(room)room.style.filter='brightness('+(0.55+ease*.6)+')';
  if(copy){copy.style.opacity=String(1-Math.min(.85,ease*1.15));copy.style.transform='translate3d(0,'+(-ease*32)+'px,0)'}
  if(outro){outro.style.opacity=String(clamp((p-.66)/.22));outro.style.transform='translateY('+(24-(clamp((p-.66)/.22)*24))+'px)'}
  if(caption)caption.textContent=String(Math.round(p*100)).padStart(2,'0')+'%';
  raf=0;
 }
 function request(){if(!raf)raf=requestAnimationFrame(render)}
 root.style.height=reduce?'100svh':'360vh';
 addEventListener('scroll',request,{passive:true});addEventListener('resize',request);render();
 const reveals=document.querySelectorAll('.cw-category-card,.teaser-copy,.contact .section-kicker,.contact h2,.contact>p,.business-contact-card,.business-address-card');
 if(reduce||!('IntersectionObserver'in window))reveals.forEach(e=>e.classList.add('cw-in-view'));
 else{const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('cw-in-view');io.unobserve(e.target)}}),{threshold:.12});reveals.forEach(e=>{e.classList.add('cw-motion-reveal');io.observe(e)})}
})();