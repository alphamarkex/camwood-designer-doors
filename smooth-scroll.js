// Site-wide smooth scrolling (Lenis). Skipped for visitors who prefer reduced motion.
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var s=document.createElement('script');
  s.src='https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js';
  s.onload=function(){
    if(!window.Lenis) return;
    var lenis=new Lenis({lerp:.09,smoothWheel:true,syncTouch:false,wheelMultiplier:1,autoRaf:true});
    window.camwoodLenis=lenis;
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click',function(e){var t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{offset:-80,duration:1.4})}});
    });
  };
  document.head.appendChild(s);
})();
