(function(){
 const root=document.querySelector('.cw-cinematic');if(!root)return;
 const panel=root.querySelector('.cw-door-panel'),copy=root.querySelector('.cw-stage-copy'),outro=root.querySelector('.cw-stage-outro'),counter=root.querySelector('.cw-progress-number');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduce){panel.style.transform='rotateY(-28deg)';return}
 let raf=0;
 const clamp=v=>Math.max(0,Math.min(1,v));
 function render(){
  const rect=root.getBoundingClientRect(),travel=Math.max(1,root.offsetHeight-window.innerHeight);
  const progress=clamp(-rect.top/travel),ease=progress<.5?4*progress*progress*progress:1-Math.pow(-2*progress+2,3)/2;
  const angle=-ease*112;
  panel.style.transform='rotateY('+angle+'deg)';
  copy.style.opacity=String(1-clamp(progress*2.1));
  copy.style.transform='translate3d(0,'+(-progress*34)+'px,0)';
  outro.style.opacity=String(clamp((progress-.56)*3.2));
  outro.style.transform='translateY('+((1-clamp((progress-.56)*3.2))*24)+'px)';
  counter.textContent=String(Math.round(progress*100)).padStart(2,'0')+'%';
  raf=0;
 }
 function request(){if(!raf)raf=requestAnimationFrame(render)}
 window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request);render();
 document.querySelectorAll('.cw-category-card').forEach((card,i)=>{card.style.setProperty('--card-index',i)});
})();