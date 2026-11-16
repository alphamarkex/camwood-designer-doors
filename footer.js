// One footer for the whole website. Edit it here and every page updates.
(function(){
  var year=new Date().getFullYear();
  var tris=[['5%','12%',70,'#f7a335','#fbd23a',20,0],['88%','16%',50,'#e91e7a','#e0342b',-24,-1.7],['92%','58%',42,'#4caf50','#9ccc3c',28,-3.4],['2%','62%',50,'#29b6e8','#2e3192',-16,-5.1]]
    .map(function(t){return '<i class="tri" style="left:'+t[0]+';top:'+t[1]+';--z:'+t[2]+'px;--a:'+t[3]+';--b:'+t[4]+';--r:'+t[5]+'deg;--dl:'+t[6]+'s"></i>'}).join('');
  var html='<footer class="foot" id="visit">'+tris+
  '<div class="wrap">'+
    '<div class="ftop"><div class="fl"><h2>Built with craft. <em>Hung for life.</em></h2>'+
      '<div class="cats" id="footCats" hidden></div>'+
      '<a class="btn" href="contact.html">Contact Camwood →</a></div>'+
      '<div class="mark"><img src="assets/camwood-logo.png" alt="Camwood – Khusi Designer Doors &amp; Windows" loading="lazy"></div></div>'+
    '<div class="fcols">'+
      '<div><h4>Explore</h4><a href="index.html">Home</a><a href="about.html">About Camwood</a><a href="collections.html">Collections</a><a href="contact.html">Contact &amp; Enquiries</a></div>'+
      '<div><h4>Contact</h4><a href="tel:9580466287">+91 95804 66287</a><a href="tel:9555375633">Office: 95553 75633</a><a href="tel:05424068679">0542-4068679</a><a href="mailto:camwoodshowroom@gmail.com">camwoodshowroom@gmail.com</a><a href="https://www.instagram.com/Camwood2017/" target="_blank" rel="noopener">Instagram @Camwood2017 ↗</a></div>'+
      '<div><h4>Showroom</h4><p>S.14/81-A-4-1-B, Maldahiya, Ground Floor, opposite Singh Medical &amp; Research Centre, Varanasi, Uttar Pradesh – 221002</p><a href="https://www.google.com/maps/search/?api=1&query=S.14%2F81-A-4-1-B%2C+Maldahiya%2C+Varanasi+221002" target="_blank" rel="noopener">Get directions ↗</a></div>'+
    '</div>'+
    '<div class="fmeta"><span>© '+year+' Khusi Designer Doors &amp; Windows · A Unit of UG Group of Companies</span><a href="#top" id="footTop">Back to top ↑</a></div>'+
  '</div></footer>';

  var me=document.currentScript;
  if(me) me.insertAdjacentHTML('beforebegin',html); else document.body.insertAdjacentHTML('beforeend',html);

  var top=document.getElementById('footTop');
  if(top) top.addEventListener('click',function(e){e.preventDefault();var l=window.camwoodLenis||window.lenis;if(l&&l.scrollTo)l.scrollTo(0,{duration:1.6});else window.scrollTo({top:0,behavior:'smooth'})});

  // category chips come from the admin panel (published categories only); hidden when there are none
  addEventListener('load',function(){try{
    var db=window.camwoodSupabase,box=document.getElementById('footCats');if(!db||!box)return;
    db.from('product_categories').select('name,slug').eq('is_published',true).order('sort_order').order('name').then(function(r){
      var d=r&&r.data;if(!d||!d.length)return;
      var esc=function(t){return String(t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
      box.innerHTML=d.map(function(c){return '<a href="collection.html?category='+encodeURIComponent(c.slug)+'">'+esc(c.name)+'</a>'}).join('');box.hidden=false});
  }catch(e){}});
})();
