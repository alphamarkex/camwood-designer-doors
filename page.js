// Light page behaviour for inner pages: current page in the header + gentle scroll reveals.
(function(){
  var f=location.pathname.split('/').pop()||'index.html';if(f==='collection.html')f='collections.html';
  document.querySelectorAll('.pill-links a').forEach(function(a){if(a.getAttribute('href')===f)a.setAttribute('aria-current','page')});
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
  var sel='main .content-card,main .contact-detail-card,main .camwood-enquiry-form,main .collections-heading,main .collection-intro>*,main .content-section>.section-kicker,main .content-section>h2,main .content-section>p,main .content-section>.button,main .content-section>div,main .collection-contact>*,main .contact-cta>*,main .product-collection-toolbar';
  var els=document.querySelectorAll(sel);
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(el,i){
    var r=el.getBoundingClientRect();if(r.top<innerHeight*.9&&r.bottom>0)return; // already on screen: no flash
    el.classList.add('reveal');
    if(el.matches('.content-card,.contact-detail-card'))el.style.transitionDelay=((i%3)*80)+'ms';
    io.observe(el);
  });
})();
