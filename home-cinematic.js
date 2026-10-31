(function(){
  const root=document.querySelector('.cw-cinematic');
  if(!root)return;
  const stage=root.querySelector('.cw-sticky-stage');
  const panel=root.querySelector('.cw-door-panel');
  const doorway=root.querySelector('.cw-doorway');
  const copy=root.querySelector('.cw-stage-copy');
  const counter=root.querySelector('.cw-progress-number');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp=v=>Math.max(0,Math.min(1,v));
  const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
  let raf=0,walkway=null,doorItems=[],chapterLabel=null,chapterIndex=-1;

  const doors=[
    {image:'page-03-image-395.webp',alt:'Camwood membrane wooden door',name:'MEMBRANE DOORS',detail:'Warm textures. Timeless character.'},
    {image:'page-09-image-6914.webp',alt:'Camwood textured designer door',name:'TEXTURED DOORS',detail:'Sculpted surfaces and expressive detail.'},
    {image:'page-12-image-11313.webp',alt:'Camwood double wooden door',name:'DOUBLE DOORS',detail:'A grand welcome with balanced symmetry.'},
    {image:'page-14-image-12887.webp',alt:'Camwood modern digital door',name:'MODERN DOORS',detail:'Contemporary design for modern spaces.'},
    {image:'page-18-image-15887.webp',alt:'Camwood wooden window design',name:'WINDOW COLLECTION',detail:'Natural light, framed beautifully.'},
    {image:'page-18-image-16870.webp',alt:'Camwood decorative jali door',name:'JALI DOORS',detail:'Intricate patterns and crafted character.'}
  ];

  // Build one continuous perspective corridor. Door displays are fixed in 3D space;
  // scrolling moves the camera through them instead of cross-fading slides.
  if(stage&&!reduce){
    walkway=document.createElement('div');
    walkway.className='cw-showroom-walkway';
    walkway.setAttribute('aria-label','Camwood showroom walkthrough');
    const ceiling=document.createElement('div');ceiling.className='cw-showroom-ceiling';
    const floor=document.createElement('div');floor.className='cw-showroom-floor';
    const leftWall=document.createElement('div');leftWall.className='cw-showroom-wall cw-showroom-wall-left';
    const rightWall=document.createElement('div');rightWall.className='cw-showroom-wall cw-showroom-wall-right';
    walkway.append(ceiling,floor,leftWall,rightWall);

    doors.forEach((data,index)=>{
      const bay=document.createElement('article');
      bay.className='cw-showroom-bay '+(index%2===0?'cw-bay-left':'cw-bay-right');
      bay.style.setProperty('--bay-z',String(-700-index*1120)+'px');
      bay.style.setProperty('--bay-index',String(index));
      const frame=document.createElement('div');frame.className='cw-showroom-frame';
      const img=document.createElement('img');img.src=data.image;img.alt=data.alt;
      img.loading=index<2?'eager':'lazy';img.decoding='async';
      const glow=document.createElement('span');glow.className='cw-showroom-light';
      frame.append(img,glow);
      const caption=document.createElement('div');caption.className='cw-showroom-door-caption';
      const name=document.createElement('strong');name.textContent=data.name;
      const detail=document.createElement('span');detail.textContent=data.detail;
      caption.append(name,detail);
      bay.append(frame,caption);walkway.appendChild(bay);
      doorItems.push({bay,frame,img,index});
    });
    const endWall=document.createElement('div');endWall.className='cw-showroom-endwall';
    const endTitle=document.createElement('strong');endTitle.textContent='WELCOME TO CAMWOOD';
    const endSub=document.createElement('span');endSub.textContent='DESIGNER DOORS & WINDOWS';
    endWall.append(endTitle,endSub);walkway.appendChild(endWall);
    stage.appendChild(walkway);

    chapterLabel=document.createElement('div');
    chapterLabel.className='cw-showroom-chapter';
    const kicker=document.createElement('span');kicker.textContent='EXPLORE THE COLLECTION';
    const title=document.createElement('strong');title.textContent='THE SHOWROOM';
    const count=document.createElement('small');count.textContent='01 / 06';
    chapterLabel.append(kicker,title,count);stage.appendChild(chapterLabel);
    root.style.height=window.matchMedia('(max-width:760px)').matches?'900vh':'1080vh';

    const progress=document.createElement('div');progress.className='cw-showroom-progress';progress.setAttribute('aria-hidden','true');
    doors.forEach(()=>progress.appendChild(document.createElement('i')));
    stage.appendChild(progress);
  }

  if(stage&&!reduce){
    const atmosphere=document.createElement('div');atmosphere.className='cw-atmosphere';atmosphere.setAttribute('aria-hidden','true');
    for(let i=0;i<22;i++){
      const mote=document.createElement('i');mote.className='cw-dust';
      mote.style.left=((i*37)%100)+'%';
      mote.style.setProperty('--duration',(10+(i%7)*1.8)+'s');
      mote.style.setProperty('--delay',(-((i*1.9)%17))+'s');
      mote.style.setProperty('--drift',(((i%7)-3)*15)+'px');
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
    const doorProgress=smooth(progress/.19);
    if(stage){
      stage.style.setProperty('--cw-progress',progress.toFixed(4));
      stage.style.setProperty('--cw-light',clamp((progress-.1)*1.8).toFixed(4));
    }
    if(panel)panel.style.transform='rotateY('+(-doorProgress*112)+'deg)';
    if(doorway)doorway.style.opacity=String(1-clamp((progress-.13)/.10));
    if(copy){
      const fade=clamp(progress/.17);
      copy.style.opacity=String(1-fade);
      copy.style.transform='translate3d(-50%,'+(-progress*35)+'px,0) scale('+(1-progress*.035)+')';
    }

    // A long, continuous camera dolly through the showroom. The same transform
    // runs in reverse when the visitor scrolls upward.
    const walkStart=.205,walkEnd=.965,walkProgress=smooth((progress-walkStart)/(walkEnd-walkStart));
    if(walkway){
      const distance=walkProgress*6900;
      const sway=Math.sin(walkProgress*Math.PI*3)*13;
      walkway.style.transform='translate3d('+sway+'px,0,'+distance+'px)';
      doorItems.forEach(({bay,frame,img,index})=>{
        const relative=700+index*1120-distance;
        const proximity=clamp(1-Math.abs(relative)/1350);
        const passed=clamp((distance-(700+index*1120))/380);
        bay.style.opacity=String(clamp(1-Math.max(0,passed)*.92));
        frame.style.transform='scale('+(0.76+proximity*.28)+') rotateY('+(index%2===0?'18deg':'-18deg')+')';
        img.style.transform='scale('+(1+proximity*.035)+')';
      });
      const current=Math.min(doors.length-1,Math.max(0,Math.floor(walkProgress*doors.length)));
      if(chapterLabel&&current!==chapterIndex){
        chapterIndex=current;
        chapterLabel.querySelector('strong').textContent=doors[current].name;
        chapterLabel.querySelector('small').textContent=String(current+1).padStart(2,'0')+' / 06';
      }
      const dots=stage.querySelectorAll('.cw-showroom-progress i');
      dots.forEach((dot,index)=>dot.classList.toggle('active',index===current));
      if(chapterLabel){
        chapterLabel.style.opacity=String(clamp((progress-walkStart)/.055)*clamp((walkEnd-progress)/.04));
      }
    }
    if(counter)counter.textContent=String(Math.round(progress*100)).padStart(2,'0')+'%';
    raf=0;
  }
  function request(){if(!raf)raf=requestAnimationFrame(render)}
  window.addEventListener('scroll',request,{passive:true});
  window.addEventListener('resize',()=>{
    if(walkway)root.style.height=window.matchMedia('(max-width:760px)').matches?'900vh':'1080vh';
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