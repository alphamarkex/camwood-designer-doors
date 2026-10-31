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
  const clamp=v=>Math.max(0,Math.min(1,v));
  const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};

  // Create a film-like, scroll-scrubbed gallery using Camwood image assets already referenced on the homepage.
  const scenesData=[
    {image:'page-03-image-395.webp',alt:'Camwood wooden membrane door design',number:'01 / THE MEMBRANE EDIT',title:'Warmth in every detail.',copy:'Natural-looking grain, balanced tones and timeless design for spaces that feel like home.'},
    {image:'page-09-image-6914.webp',alt:'Camwood sculpted textured designer door',number:'02 / TEXTURE & FORM',title:'Made to be noticed.',copy:'Sculpted surfaces and expressive patterns bring depth, character and a striking first impression.'},
    {image:'page-12-image-11313.webp',alt:'Camwood double door design',number:'03 / THE DOUBLE DOOR COLLECTION',title:'Make an entrance.',copy:'A confident sense of scale, symmetry and craftsmanship for the spaces that deserve a grand arrival.'},
    {image:'page-14-image-12887.webp',alt:'Camwood modern digital door design',number:'04 / MODERN LIVING',title:'A smarter statement.',copy:'Contemporary door designs bring together considered details and a modern architectural mood.'},
    {image:'page-18-image-15887.webp',alt:'Camwood solid wood window design',number:'05 / WINDOWS & LIGHT',title:'Frame the feeling.',copy:'Bring warmth, natural character and a considered finish to the view beyond your walls.'},
    {image:'page-18-image-16870.webp',alt:'Camwood decorative jali door design',number:'06 / JALI & DECORATIVE DETAILS',title:'Crafted to stand apart.',copy:'Decorative patterns and intricate details turn functional openings into architectural features.'}
  ];
  let film=null,sceneEls=[];
  if(stage&&!reduce){
    film=document.createElement('div');
    film.className='cw-film-sequence';
    film.setAttribute('aria-label','Scroll through the Camwood door collections');
    scenesData.forEach((data,index)=>{
      const scene=document.createElement('section');
      scene.className='cw-film-scene';
      scene.setAttribute('aria-label',data.title);
      const visual=document.createElement('div');
      visual.className='cw-film-visual';
      const img=document.createElement('img');
      img.src=data.image;img.alt=data.alt;img.loading=index===0?'eager':'lazy';img.decoding='async';
      visual.appendChild(img);
      const content=document.createElement('div');
      content.className='cw-film-copy';
      content.innerHTML='<span class="cw-film-number"></span><div class="cw-film-rule"></div><h2></h2><p></p>';
      content.querySelector('.cw-film-number').textContent=data.number;
      content.querySelector('h2').textContent=data.title;
      content.querySelector('p').textContent=data.copy;
      const footer=document.createElement('div');
      footer.className='cw-film-bottom';
      const left=document.createElement('span');left.textContent='CAMWOOD DESIGNER DOORS & WINDOWS';
      const right=document.createElement('span');right.textContent=String(index+1).padStart(2,'0')+' / 06';
      footer.append(left,right);
      scene.append(visual,content,footer);
      film.appendChild(scene);sceneEls.push({scene,img});
    });
    const progress=document.createElement('div');
    progress.className='cw-film-progress';progress.setAttribute('aria-hidden','true');
    scenesData.forEach(()=>progress.appendChild(document.createElement('i')));
    film.appendChild(progress);
    stage.appendChild(film);
    root.style.height=window.matchMedia('(max-width:760px)').matches?'590vh':'640vh';
  }

  if(stage&&!reduce){
    const atmosphere=document.createElement('div');
    atmosphere.className='cw-atmosphere';atmosphere.setAttribute('aria-hidden','true');
    for(let i=0;i<26;i++){
      const mote=document.createElement('i');mote.className='cw-dust';
      mote.style.left=((i*37)%100)+'%';
      mote.style.setProperty('--duration',(9+(i%8)*1.7)+'s');
      mote.style.setProperty('--delay',(-((i*1.9)%17))+'s');
      mote.style.setProperty('--drift',(((i%7)-3)*17)+'px');
      atmosphere.appendChild(mote);
    }
    stage.appendChild(atmosphere);
    const glint=document.createElement('span');glint.className='cw-door-glint';
    glint.setAttribute('aria-hidden','true');panel?.appendChild(glint);
  }

  function render(){
    const rect=root.getBoundingClientRect();
    const travel=Math.max(1,root.offsetHeight-window.innerHeight);
    const progress=clamp(-rect.top/travel);
    const doorProgress=smooth(progress/.23);
    if(stage){
      stage.style.setProperty('--cw-progress',progress.toFixed(4));
      stage.style.setProperty('--cw-light',clamp((progress-.12)*1.9).toFixed(4));
    }
    if(panel)panel.style.transform='rotateY('+(-doorProgress*112)+'deg)';
    if(copy){
      const introFade=clamp(progress/.18);
      copy.style.opacity=String(1-introFade);
      copy.style.transform='translate3d(0,'+(-progress*42)+'px,0) scale('+(1-progress*.05)+')';
    }

    // Six cinematic scenes occupy the middle of the scroll film. Every transform is tied to scroll position.
    const filmStart=.235,filmEnd=.925,filmSpan=(filmEnd-filmStart)/Math.max(1,sceneEls.length);
    sceneEls.forEach(({scene,img},index)=>{
      const local=(progress-(filmStart+index*filmSpan))/filmSpan;
      const enter=smooth(local/.22);
      const leave=smooth((1-local)/.22);
      const opacity=clamp(Math.min(enter,leave));
      const active=local>-.03&&local<1.03;
      scene.style.visibility=active?'visible':'hidden';
      scene.style.opacity=String(opacity);
      scene.style.transform='scale('+(1.055-.055*opacity)+') translate3d(0,'+((1-opacity)*18)+'px,0)';
      img.style.transform='translate3d('+( (1-opacity)*34 )+'px,0,0) scale('+(1.04+opacity*.035)+')';
      scene.classList.toggle('is-active',opacity>.02);
      const dot=film?.querySelectorAll('.cw-film-progress i')[index];
      if(dot)dot.classList.toggle('active',opacity>.15);
    });
    if(outro){
      const reveal=smooth((progress-.925)/.075);
      outro.style.opacity=String(reveal);
      outro.style.transform='translateY('+((1-reveal)*30)+'px)';
    }
    if(counter)counter.textContent=String(Math.round(progress*100)).padStart(2,'0')+'%';
    if(film)film.style.opacity=reduce?'1':'1';
    raf=0;
  }
  function request(){if(!raf)raf=requestAnimationFrame(render)}
  window.addEventListener('scroll',request,{passive:true});
  window.addEventListener('resize',()=>{
    root.style.height=window.matchMedia('(max-width:760px)').matches?'590vh':'640vh';
    request();
  });
  render();

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
        if(entry.isIntersecting){entry.target.classList.add('cw-in-view');observer.unobserve(entry.target)}
      });
    },{threshold:.12,rootMargin:'0px 0px -7% 0px'});
    revealTargets.forEach(el=>observer.observe(el));
  }
})();