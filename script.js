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


// Trend-style scroll storytelling: stagger headings and give real media a subtle parallax drift.
const storyHeadings=document.querySelectorAll('main h1,main h2,main h3');
storyHeadings.forEach((el,i)=>{if(!el.closest('.hero')){el.classList.add('scroll-title');if('IntersectionObserver'in window){const titleObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('title-in-view');titleObserver.unobserve(entry.target)}}),{threshold:.25});titleObserver.observe(el)}else el.classList.add('title-in-view')}});
const parallaxMedia=document.querySelectorAll('.product-card img,.category-card img,.feature-image img,.latest-bg,.collection-row img,.top-selling img');
parallaxMedia.forEach(el=>el.classList.add('scroll-parallax-media'));

// Cinematic gate opening follows the hero's own scroll progress, not total page scroll.
const hero=document.querySelector('.hero');
const door=document.querySelector('.door-leaf');
const heroCopy=document.querySelector('.hero-copy');
const latestBg=document.querySelector('.latest-bg');
let ticking=false;
const clamp01=value=>Math.max(0,Math.min(1,value));
function updateScrollMotion(){
  const vh=window.innerHeight||1;
  if(hero&&door){
    const rect=hero.getBoundingClientRect();
    const progress=clamp01(-rect.top/Math.max(1,hero.offsetHeight*.72));
    const eased=progress*progress*(3-2*progress);
    const angle=-eased*116;
    door.style.transform='rotateY('+angle+'deg)';
    hero.style.setProperty('--scene-progress',String(progress));
    hero.style.setProperty('--door-open',angle+'deg');
    if(heroCopy){
      heroCopy.style.transform='translate3d(0,'+(-progress*28)+'px,0)';
      heroCopy.style.opacity=String(1-progress*.62);
    }
  }
  if(latestBg){
    const section=latestBg.closest('.latest-drop');
    const rect=section.getBoundingClientRect();
    const progress=(vh-rect.top)/(vh+rect.height);
    latestBg.style.transform='scale(1.12) translate3d(0,'+((progress-.5)*-42)+'px,0)';
  }
  parallaxMedia.forEach(el=>{
    const rect=el.getBoundingClientRect();
    if(rect.bottom>-120&&rect.top<vh+120){
      const center=(rect.top+rect.height/2-vh/2)/vh;
      el.style.setProperty('--media-shift',(center*-13)+'px');
    }
  });
  // A subtle cinematic color grade evolves as the visitor moves through the page.
  const sections=[...document.querySelectorAll('main > section')];
  let activeIndex=0, best=-Infinity;
  sections.forEach((section,index)=>{
    const rect=section.getBoundingClientRect();
    const score=Math.min(rect.bottom,vh)-Math.max(rect.top,0);
    if(score>best){best=score;activeIndex=index}
  });
  const grades=['#090c12','#151a24','#20245f','#122e37','#20245f','#111820'];
  document.body.style.setProperty('--scroll-grade',grades[activeIndex%grades.length]);
  document.body.classList.toggle('cinematic-scroll',window.scrollY<vh*.35);
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