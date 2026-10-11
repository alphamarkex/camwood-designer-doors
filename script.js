const menuBtn=document.getElementById('menuBtn');
const nav=document.querySelector('.nav');
menuBtn?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const revealTargets=document.querySelectorAll('.intro-strip,.section-top,.product-card,.showcase-foot,.collections-heading,.collection-row,.feature-image,.feature-copy,.contact>*');
revealTargets.forEach((el,i)=>{el.classList.add('reveal');if(el.classList.contains('collection-row'))el.style.transitionDelay=`${(i%4)*70}ms`});
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.12});revealTargets.forEach(el=>observer.observe(el))}else revealTargets.forEach(el=>el.classList.add('in-view'));
// The door opens on entry; scrolling then hands the focus to the real catalogue showcase.
const door=document.querySelector('.door-leaf');
const showcase=document.querySelector('#showcase');
if(door&&showcase&&'IntersectionObserver'in window){const focusObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)document.body.classList.add('showcase-active');else document.body.classList.remove('showcase-active')}),{threshold:.18});focusObserver.observe(showcase)}