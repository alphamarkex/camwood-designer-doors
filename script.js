const menuBtn=document.getElementById('menuBtn');
const nav=document.querySelector('.nav');
menuBtn?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

// Scroll reveals: each catalogue piece arrives as the visitor moves through the story.
const revealTargets=document.querySelectorAll('.intro-strip,.section-top,.product-card,.showcase-foot,.collections-heading,.collection-row,.category-card,.top-selling,.top-selling-links a,.feature-image,.feature-copy,.contact>* ,.latest-content');
revealTargets.forEach((el,i)=>{el.classList.add('reveal');if(el.classList.contains('collection-row'))el.style.transitionDelay=`${(i%4)*70}ms`});
if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.12});
  revealTargets.forEach(el=>observer.observe(el));
}else revealTargets.forEach(el=>el.classList.add('in-view'));

// Door opening is tied to the user's scroll, so the catalogue is literally revealed by the door.
const hero=document.querySelector('.hero');
const door=document.querySelector('.door-leaf');
const heroCopy=document.querySelector('.hero-copy');
const latestBg=document.querySelector('.latest-bg');
let ticking=false;
function updateScrollMotion(){
  const y=window.scrollY||window.pageYOffset;
  if(hero&&door){
    const distance=Math.max(1,hero.offsetHeight*.78);
    const progress=Math.max(0,Math.min(1,y/distance));
    const eased=progress*progress*(3-2*progress);
    door.style.setProperty('--door-open',`${-eased*112}deg`);
    door.style.transform=`rotateY(${-eased*112}deg)`;
    if(heroCopy){heroCopy.style.transform=`translate3d(0,${-progress*36}px,0)`;heroCopy.style.opacity=String(1-progress*.45)}
  }
  if(latestBg){
    const section=latestBg.closest('.latest-drop');
    const rect=section.getBoundingClientRect();
    const progress=(window.innerHeight-rect.top)/(window.innerHeight+rect.height);
    latestBg.style.transform=`scale(1.12) translate3d(0,${(progress-.5)*-42}px,0)`;
  }
  ticking=false;
}
function requestScrollMotion(){if(!ticking){window.requestAnimationFrame(updateScrollMotion);ticking=true}}
window.addEventListener('scroll',requestScrollMotion,{passive:true});
window.addEventListener('resize',requestScrollMotion);
updateScrollMotion();

const showcase=document.querySelector('#showcase');
if(showcase&&'IntersectionObserver'in window){
  const focusObserver=new IntersectionObserver(entries=>entries.forEach(entry=>document.body.classList.toggle('showcase-active',entry.isIntersecting)),{threshold:.18});
  focusObserver.observe(showcase);
}

// Keep the intro cinematic, but respect reduced-motion settings.
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelector('.intro')?.remove();
  if(door)door.style.transform='rotateY(-12deg)';
}