(function(){
  const root=document.querySelector('.cw-cinematic');
  if(!root)return;
  const stage=root.querySelector('.cw-sticky-stage');
  const panel=root.querySelector('.cw-door-panel');
  const copy=root.querySelector('.cw-stage-copy');
  const outro=root.querySelector('.cw-stage-outro');
  const counter=root.querySelector('.cw-progress-number');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf=0;

  // Atmospheric dust and a subtle moving highlight, all contained in the homepage stage.
  if(stage&&!reduce){
    const atmosphere=document.createElement('div');
    atmosphere.className='cw-atmosphere';
    atmosphere.setAttribute('aria-hidden','true');
    for(let i=0;i<26;i++){
      const mote=document.createElement('i');
      mote.className='cw-dust';
      mote.style.left=((i*37)%100)+'%';
      mote.style.setProperty('--duration',(9+(i%8)*1.7)+'s');
      mote.style.setProperty('--delay',(-((i*1.9)%17))+'s');
      mote.style.setProperty('--drift',(((i%7)-3)*17)+'px');
      atmosphere.appendChild(mote);
    }
    stage.appendChild(atmosphere);
    const glint=document.createElement('span');
    glint.className='cw-door-glint';
    glint.setAttribute('aria-hidden','true');
    panel?.appendChild(glint);
  }

  const clamp=v=>Math.max(0,Math.min(1,v));
  function render(){
    const rect=root.getBoundingClientRect();
    const travel=Math.max(1,root.offsetHeight-window.innerHeight);
    const progress=clamp(-rect.top/travel);
    const ease=progress<.5?4*progress*progress*progress:1-Math.pow(-2*progress+2,3)/2;
    if(stage){
      stage.style.setProperty('--cw-progress',progress.toFixed(4));
      stage.style.setProperty('--cw-light',clamp((progress-.16)*1.7).toFixed(4));
    }
    if(panel)panel.style.transform='rotateY('+(-ease*112)+'deg)';
    if(copy){
      copy.style.opacity=String(1-clamp(progress*2.1));
      copy.style.transform='translate3d(0,'+(-progress*34)+'px,0)';
    }
    if(outro){
      const reveal=clamp((progress-.56)*3.2);
      outro.style.opacity=String(reveal);
      outro.style.transform='translateY('+((1-reveal)*24)+'px)';
    }
    if(counter)counter.textContent=String(Math.round(progress*100)).padStart(2,'0')+'%';
    raf=0;
  }
  function request(){if(!raf)raf=requestAnimationFrame(render)}
  window.addEventListener('scroll',request,{passive:true});
  window.addEventListener('resize',request);
  render();

  // Staggered, scroll-triggered reveals across the homepage; no shared-site styles are changed.
  const revealTargets=[
    ...document.querySelectorAll('.cw-category-card'),
    ...document.querySelectorAll('.product-card'),
    ...document.querySelectorAll('.latest-content,.feature-copy,.feature-image,.teaser-copy,.contact .section-kicker,.contact h2,.contact>p,.business-contact-card,.business-address-card')
  ];
  revealTargets.forEach((el,index)=>{
    el.classList.add('cw-motion-reveal');
    if(el.classList.contains('cw-category-card'))el.style.setProperty('--cw-delay',(index%2)*110+'ms');
  });
  if(reduce||!('IntersectionObserver'in window)){
    revealTargets.forEach(el=>el.classList.add('cw-in-view'));
  }else{
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('cw-in-view');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.12,rootMargin:'0px 0px -7% 0px'});
    revealTargets.forEach(el=>observer.observe(el));
  }
})();