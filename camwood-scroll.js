(function(){
 const root=document.querySelector('.cw-cinematic'),stage=root?.querySelector('.cw-sticky-stage'),experience=stage?.querySelector('.cw-experience');
 if(!root||!stage||!experience)return;
 const scenes=[...experience.querySelectorAll('.cw-scene')],progress=experience.querySelector('.cw-experience-progress');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(progress)progress.querySelectorAll('button').forEach((button,index)=>button.addEventListener('click',()=>{
  const target=root.offsetTop+(root.offsetHeight-innerHeight)*(index/(scenes.length-1));
  window.scrollTo({top:target,behavior:reduce?'auto':'smooth'});
 }));
 let raf=0;const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
 function render(){
  const rect=root.getBoundingClientRect(),span=Math.max(1,root.offsetHeight-innerHeight),overall=reduce?0:clamp(-rect.top/span),segment=1/scenes.length;
  scenes.forEach((scene,index)=>{
   const local=clamp((overall-index*segment)/segment),fadeIn=smooth(local/.22),fadeOut=1-smooth((local-.72)/.28);
   const opacity=index===0?fadeOut:Math.min(fadeIn,fadeOut),visible=opacity>.015;
   scene.style.opacity=String(opacity);scene.style.visibility=visible?'visible':'hidden';
   scene.style.transform='translate3d(0,'+((1-opacity)*22)+'px,0) scale('+(1.018-opacity*.018)+')';scene.classList.toggle('is-active',visible);
   const image=scene.querySelector('.cw-scene-visual img,.cw-opening-image img');
   if(image){const zoom=scene.classList.contains('cw-scene--opening')?1+local*.14:1.04-local*.07;image.style.transform='translate3d('+(scene.classList.contains('cw-scene--opening')?-local*3:local*-1.8)+'%,0,0) scale('+zoom+')'}
   if(progress&&progress.children[index])progress.children[index].setAttribute('aria-current',opacity>.45?'true':'false');
  });raf=0;
 }
 function request(){if(!raf)raf=requestAnimationFrame(render)}
 addEventListener('scroll',request,{passive:true});addEventListener('resize',request);render();
})();