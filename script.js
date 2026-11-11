(function(){
  var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  /* mobile navigation */
  var menuToggle=$('.menu-toggle'),menu=$('#primary-menu');
  function setMenu(open){
    menuToggle.setAttribute('aria-expanded',String(open));
    menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    $('.nav').classList.toggle('menu-open',open);
  }
  menuToggle.addEventListener('click',function(){setMenu(menuToggle.getAttribute('aria-expanded')!=='true')});
  $$('#primary-menu a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});

  /* theme toggle */
  var themeToggle=$('.theme-toggle');
  themeToggle.addEventListener('click',function(){
    var light=document.documentElement.dataset.theme!=='light';
    document.documentElement.dataset.theme=light?'light':'dark';
    themeToggle.setAttribute('aria-label',light?'Switch to dark mode':'Switch to light mode');
    themeToggle.title=light?'Switch to dark mode':'Switch to light mode';
    themeToggle.firstElementChild.textContent=light?'☾':'☼';
  });

  /* project search */
  var projectSearch=$('#project-search'),projectCards=$$('.card'),projectResults=$('#project-results');
  projectSearch.addEventListener('input',function(){
    var query=projectSearch.value.trim().toLowerCase(),matches=0;
    projectCards.forEach(function(card){
      var visible=!query||card.textContent.toLowerCase().indexOf(query)!==-1;
      card.hidden=!visible;
      if(visible)matches++;
    });
    projectResults.textContent=query?(matches?matches+' project'+(matches===1?'':'s')+' found':'No projects found'):'';
    if(window.ScrollTrigger)window.ScrollTrigger.refresh();
  });

  /* modal */
  var modal=$('#modal'),last=null;
  function openM(){last=document.activeElement;setMenu(false);modal.hidden=false;$('#contact-name').focus()}
  function closeM(){modal.hidden=true;if(last)last.focus()}
  $$('[data-contact]').forEach(function(b){b.addEventListener('click',openM)});
  $$('[data-close]').forEach(function(b){b.addEventListener('click',closeM)});
  modal.addEventListener('click',function(e){if(e.target===modal)closeM()});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&!modal.hidden)closeM();
    if(e.key==='Escape'&&menuToggle.getAttribute('aria-expanded')==='true'){setMenu(false);menuToggle.focus()}
  });
  $('#contact-form').addEventListener('submit',function(e){
    e.preventDefault();
    var form=e.currentTarget;
    if(!form.reportValidity())return;
    var values=new FormData(form);
    var subject='Portfolio message from '+values.get('name');
    var body='Name: '+values.get('name')+'\nEmail: '+values.get('email')+'\n\n'+values.get('message');
    $('#form-status').textContent='Your email app should open with your message ready to send.';
    window.location.href='mailto:'+$('#mail').textContent+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
  $('#copy').addEventListener('click',function(){
    var b=this,t=$('#mail').textContent;
    function sel(){var r=document.createRange();r.selectNodeContents($('#mail'));var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Select, then copy'}
    try{navigator.clipboard.writeText(t).then(function(){b.textContent='Copied'},sel)}catch(e){sel()}
  });

  /* local time */
  function tick(){try{$('#clock').textContent=new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Banjul'})}catch(e){}}
  tick();setInterval(tick,30000);

  /* globe */
  (function(){
    var cv=$('#globe'),ctx=cv.getContext('2d'),W=0,pts=[],N=900,i,running=true,ang=.29,tilt=.34;
    for(i=0;i<N;i++){var y=1-(i/(N-1))*2,r=Math.sqrt(1-y*y),t=i*2.399963;pts.push([Math.cos(t)*r,y,Math.sin(t)*r])}
    function ll(la,lo){la*=Math.PI/180;lo*=Math.PI/180;return [Math.cos(la)*Math.sin(lo),Math.sin(la),Math.cos(la)*Math.cos(lo)]}
    var home=ll(13.4,-16.6),others=[ll(6.5,3.4),ll(5.6,-.2),ll(8.5,-13.2),ll(9.1,7.4)];
    function size(){var d=window.devicePixelRatio||1,w=cv.clientWidth;W=w;cv.width=w*d;cv.height=w*d;ctx.setTransform(d,0,0,d,0,0)}
    function proj(p){var ca=Math.cos(ang),sa=Math.sin(ang),x=p[0]*ca+p[2]*sa,z=-p[0]*sa+p[2]*ca,ct=Math.cos(tilt),st=Math.sin(tilt),y=p[1]*ct-z*st;z=p[1]*st+z*ct;return [x,y,z]}
    function draw(){
      var T=performance.now()/1000;ang=.29+Math.sin(T*.35)*.42;
      ctx.clearRect(0,0,W,W);var R=W*.42,c=W/2,k,q;
      ctx.strokeStyle='rgba(201,169,106,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(c,c,R,0,7);ctx.stroke();
      for(k=0;k<N;k++){q=proj(pts[k]);if(q[2]<0)continue;ctx.fillStyle='rgba(234,217,172,'+(.15+.6*q[2]).toFixed(2)+')';ctx.fillRect(c+q[0]*R,c-q[1]*R,1.4,1.4)}
      var H=proj(home),hx=c+H[0]*R,hy=c-H[1]*R;
      others.forEach(function(p,idx){var q=proj(p);if(q[2]<=0)return;var x=c+q[0]*R,y=c-q[1]*R;
        ctx.strokeStyle='rgba(201,169,106,.5)';ctx.beginPath();ctx.moveTo(hx,hy);ctx.quadraticCurveTo((hx+x)/2,(hy+y)/2-W*.08,x,y);ctx.stroke();
        ctx.fillStyle='#c9a96a';ctx.beginPath();ctx.arc(x,y,2.6,0,7);ctx.fill()});
      if(H[2]>0){ctx.fillStyle='#ead9ac';ctx.beginPath();ctx.arc(hx,hy,4.5,0,7);ctx.fill();
        var pr=(T*.5)%1;ctx.strokeStyle='rgba(234,217,172,'+(1-pr).toFixed(2)+')';ctx.beginPath();ctx.arc(hx,hy,5+pr*22,0,7);ctx.stroke()}
    }
    function loop(){if(running)draw();requestAnimationFrame(loop)}
    size();window.addEventListener('resize',size);loop();
    if('IntersectionObserver' in window){new IntersectionObserver(function(e){running=e[0].isIntersecting},{rootMargin:'100px'}).observe(cv)}
  })();

  /* cursor */
  var cur=$('.cursor');
  if(window.gsap&&matchMedia('(pointer:fine)').matches){
    var qx=gsap.quickTo(cur,'x',{duration:.35,ease:'power3'}),qy=gsap.quickTo(cur,'y',{duration:.35,ease:'power3'});
    window.addEventListener('pointermove',function(e){cur.classList.add('on');qx(e.clientX);qy(e.clientY)});
    document.addEventListener('pointerover',function(e){cur.classList.toggle('hov',!!e.target.closest('a,button,.beyond li'))});
  }

  if(!window.gsap||!window.ScrollTrigger){return}
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ignoreMobileResize:true});
  var mm=gsap.matchMedia(),sts={};

  mm.add({desk:'(min-width: 861px)',mob:'(max-width: 860px)',ok:'(prefers-reduced-motion: no-preference)',rm:'(prefers-reduced-motion: reduce)'},function(ctx){
    var c=ctx.conditions,D=c.desk;
    if(c.rm){
      $('.hero').style.cssText='height:auto;overflow:visible';
      $('.hero-copy').style.cssText='position:static;transform:none;width:auto;padding:18vh 24px 4vh';
      $('.cabin').style.cssText='position:relative;inset:auto;height:68vh;overflow:hidden';
      $('.stmts').style.cssText='position:static;display:block;padding:6vh 24px';
      $$('.stmt').forEach(function(s){s.style.opacity=1;s.style.marginBottom='36px'});
      $('.cue').style.display='none';
      $$('.fill').forEach(function(s){s.style.clipPath='none'});$('.sweep').style.display='none';
      $('.legacy').style.height='60vh';
      $('.ben').style.cssText='height:auto;overflow:visible;padding:16vh 0 8vh';
      $('.ben-title').style.cssText='position:static;margin-bottom:30px';
      $$('.card').forEach(function(k){k.style.cssText='position:relative;top:auto;left:auto;margin:0 auto 20px;height:auto'});
      return;
    }

    /* HERO: portrait stays in view while the story follows on scroll */
    var h=gsap.timeline({scrollTrigger:{id:'hero',trigger:'#hero',start:'top top',end:'+=720%',pin:true,scrub:.7,anticipatePin:1,invalidateOnRefresh:true}});
    sts.hero=h.scrollTrigger;
    h.to('.hero-copy',{autoAlpha:0,y:D?-30:-40,duration:.9,ease:'power1.in'},0)
     .to('.cue',{autoAlpha:0,duration:.3},0)
     .to('.glow',{opacity:.55,duration:2},0);
    var stm=$$('.stmt'),n=stm.length;
    stm.forEach(function(el,i){
      var t=2.9+i*2.3;
      h.fromTo(el,{autoAlpha:0,y:44},{autoAlpha:1,y:0,duration:.7,ease:'power2.out'},t);
      if(i<n-1)h.to(el,{autoAlpha:0,y:-44,duration:.6,ease:'power2.in'},t+1.6);
    });
    h.to({},{duration:.9});

    /* SELECTED WORK: gold sweep paints the title */
    var L=gsap.timeline({scrollTrigger:{id:'legacy',trigger:'#work-intro',start:'top top',end:'+=240%',pin:true,scrub:.6,anticipatePin:1,invalidateOnRefresh:true}});
    sts.legacy=L.scrollTrigger;
    L.fromTo('.sweep',{x:-10},{x:function(){return innerWidth},duration:2.6,ease:'none'},0)
     .fromTo('.fill',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:2.6,ease:'none'},0)
     .fromTo('.sub',{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.6},2);

    /* PROJECT CARDS stack up */
    var cards=$$('.card'),B=gsap.timeline({scrollTrigger:{id:'benefits',trigger:'#work',start:'top top',end:'+=420%',pin:true,scrub:.6,anticipatePin:1}});
    sts.benefits=B.scrollTrigger;
    cards.forEach(function(k,i){
      if(!i)return;
      B.fromTo(k,{yPercent:110},{yPercent:0,duration:1,ease:'power2.out'},i*1.3-.8);
      B.to(cards[i-1],{scale:.94,opacity:.35,y:-14,duration:1,ease:'none'},i*1.3-.8);
    });
    B.to({},{duration:.5});

    /* reveals + journey line */
    gsap.utils.toArray('.spec,.spec-head,.global-grid > *').forEach(function(el){
      gsap.from(el,{y:36,autoAlpha:0,duration:.9,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}});
    });
    gsap.fromTo('.tl-line',D?{scaleX:0}:{scaleY:0},D?{scaleX:1,ease:'none',scrollTrigger:{trigger:'.tl',start:'top 80%',end:'bottom 60%',scrub:.6}}:{scaleY:1,ease:'none',scrollTrigger:{trigger:'.tl',start:'top 80%',end:'bottom 60%',scrub:.6}});
  });

  $$('[data-go]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();var id=a.dataset.go,y;
      if(id==='about'&&sts.hero){y=sts.hero.start+(sts.hero.end-sts.hero.start)*.2}
      else if(sts[id]){y=sts[id].start}
      else{var el=document.getElementById(id==='hero'?'hero':id);y=el?el.getBoundingClientRect().top+scrollY:0}
      window.scrollTo({top:y,behavior:'smooth'});
    });
  });
  window.addEventListener('load',function(){ScrollTrigger.refresh()});
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){ScrollTrigger.refresh()})}
})();
