(function(){
  var CONFIG={
    WEB3FORMS_KEY:"9102fb4a-3441-4fd4-b5ed-c512e0a7eff2",
    META_PIXEL_ID:"",PHONE:"+14842583749",EMAIL:"crystalflowdrains@gmail.com"
  };

  if(CONFIG.META_PIXEL_ID){
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init',CONFIG.META_PIXEL_ID);fbq('track','PageView');
  }
  function track(ev,d){try{if(window.fbq)fbq('track',ev,d||{});}catch(e){}}

  document.getElementById('yr').textContent=new Date().getFullYear();

  var towns=["Womelsdorf","Reading","Robesonia","Myerstown","Wernersville","Richland","Newmanstown","Schaefferstown","Bernville","Bethel","Sinking Spring","Wyomissing","West Reading","Reinholds","Stevens","Adamstown","Stouchsburg","Sheridan","Rehrersburg","Fredericksburg","Jonestown","Lititz","Ephrata","Denver","Akron","Manheim","Lebanon","Annville","Palmyra","Cleona","Lancaster"];
  document.querySelectorAll('[data-chips]').forEach(function(box){towns.forEach(function(t){var s=document.createElement('span');s.className='chip';s.textContent=t;box.appendChild(s);});});

  // ---- inline icons: phone, text, quote, promise, service cards ----
  function ic(id,cls){return '<svg class="'+(cls||'bico')+'" aria-hidden="true"><use href="#'+id+'"></use></svg>';}
  document.querySelectorAll('[data-track-call]').forEach(function(el){
    if(el.querySelector('b')||el.hasAttribute('data-no-icon'))return;
    if(el.innerHTML.indexOf('📞')>-1){el.innerHTML=el.innerHTML.replace('📞',ic('i-phone'));}
    else if(el.innerHTML.indexOf('i-phone')===-1){el.innerHTML=ic('i-phone')+' '+el.innerHTML;}
  });
  document.querySelectorAll('[data-track-text]').forEach(function(el){
    if(el.hasAttribute('data-no-icon'))return;
    if(el.innerHTML.indexOf('💬')>-1){el.innerHTML=el.innerHTML.replace('💬',ic('i-chat'));}
    else if(el.innerHTML.indexOf('i-chat')===-1){el.innerHTML=ic('i-chat')+' '+el.innerHTML;}
  });
  document.querySelectorAll('.btn[data-quote]').forEach(function(el){if(el.innerHTML.indexOf('i-drop')===-1)el.innerHTML=ic('i-drop')+' '+el.innerHTML;});
  var pmap={'🧾':'i-doc','🔒':'i-shield','✅':'i-check','👤':'i-user'};
  document.querySelectorAll('.why .ic').forEach(function(el){var k=el.textContent.trim();if(pmap[k])el.innerHTML=ic(pmap[k],'pico');});
  document.querySelectorAll('.card').forEach(function(card){
    var box=card.querySelector('.ico');if(!box)return;
    var h=((card.querySelector('h3')||{}).textContent||'').toLowerCase();
    var id='i-wrench';
    if(h.indexOf('sewer')>-1||h.indexOf('pipe')>-1||h.indexOf('main')>-1)id='i-pipe';
    else if(h.indexOf('drain')>-1||h.indexOf('hydro')>-1||h.indexOf('tub')>-1||h.indexOf('shower')>-1)id='i-drop';
    else if(h.indexOf('emergency')>-1)id='i-bolt';
    else if(h.indexOf('inspection')>-1)id='i-clock';
    box.innerHTML=ic(id,'svc');
  });

  document.addEventListener('click',function(e){
    if(e.target.closest('[data-quote]')){e.preventDefault();openQuote();}
    if(e.target.closest('[data-close-ad]'))closeAd();
    if(e.target.closest('[data-close-quote]'))closeQuote();
    if(e.target===quoteOverlay)closeQuote();
    if(e.target===adOverlay)closeAd();
    if(e.target.closest('[data-track-call]'))track('Contact',{method:'call'});
    if(e.target.closest('[data-track-text]'))track('Contact',{method:'text'});
  });

  document.getElementById('menuBtn').addEventListener('click',function(){document.getElementById('nav').classList.toggle('open');});

  var adOverlay=document.getElementById('adOverlay'),quoteOverlay=document.getElementById('quoteOverlay');
  function openQuote(){resetQuote();quoteOverlay.classList.add('open');document.body.style.overflow='hidden';track('InitiateCheckout');}
  function closeQuote(){quoteOverlay.classList.remove('open');document.body.style.overflow='';}
  function closeAd(){adOverlay.classList.remove('open');document.body.style.overflow='';}
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeQuote();closeAd();}});
  var adShown=false,isTouch=('ontouchstart'in window)||navigator.maxTouchPoints>0;
  function showAd(fromExit){if(adShown)return;if(quoteOverlay.classList.contains('open'))return;adShown=true;adOverlay.classList.add('open');document.body.style.overflow='hidden';}
  if(!isTouch){document.addEventListener('mouseout',function(e){if(!e.relatedTarget&&e.clientY<=0&&(e.clientX>0&&e.clientX<window.innerWidth)){showAd(true);}});}
  setTimeout(function(){showAd(false);},12000);

  // ===== Quote: 2 steps (2 questions, then 3) =====
  var qs1=document.getElementById('qs1'),qs2=document.getElementById('qs2'),qsDone=document.getElementById('qsDone');
  var bar=document.getElementById('qBar'),label=document.getElementById('qLabel');
  var backBtn=document.getElementById('qBack'),nextBtn=document.getElementById('qNext'),sendBtn=document.getElementById('qSend');
  var stepNow=1;
  function setStep(n){
    stepNow=n;
    qs1.classList.toggle('active',n===1);
    qs2.classList.toggle('active',n===2);
    qsDone.classList.toggle('active',n===3);
    if(n===3){
      label.textContent='';bar.style.transform='scaleX(1)';
      backBtn.classList.add('hidden');nextBtn.classList.add('hidden');sendBtn.classList.add('hidden');
      document.querySelector('#quoteOverlay .q-foot').style.display='none';
      return;
    }
    document.querySelector('#quoteOverlay .q-foot').style.display='flex';
    backBtn.classList.toggle('hidden',n===1);
    nextBtn.classList.toggle('hidden',n!==1);
    sendBtn.classList.toggle('hidden',n!==2);
    label.textContent='Step '+n+' of 2';
    bar.style.transform='scaleX('+(n===1?0.5:1)+')';
  }
  function resetQuote(){document.querySelector('#quoteOverlay .q-foot').style.display='flex';sendBtn.disabled=false;sendBtn.textContent='Send My Quote Request';setStep(1);}
  nextBtn.addEventListener('click',function(){setStep(2);});
  backBtn.addEventListener('click',function(){setStep(1);});
  function val(id){var el=document.getElementById(id);return el?el.value.trim():'';}
  function pref(){var c=document.querySelector('input[name="qpref"]:checked');return c?c.value:'Text';}
  function mailtoFallback(p){var subject='New Quote Request, '+(p.name||'Crystal Flow website');var body='New quote request from the website\n\nService: '+p.service+'\nTown: '+p.town+'\nName: '+p.name+'\nPhone: '+p.phone+'\nPrefers: '+p.prefer+'\n';window.location.href='mailto:'+CONFIG.EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);}
  sendBtn.addEventListener('click',function(){
    var p={service:val('qService'),town:val('qTown'),name:val('qName'),phone:val('qPhone'),prefer:pref()};
    if(!p.phone){var ph=document.getElementById('qPhone');ph.focus();ph.style.borderColor='#f2b714';ph.style.boxShadow='0 0 0 3px rgba(247,201,72,.25)';return;}
    var hasKey=CONFIG.WEB3FORMS_KEY&&CONFIG.WEB3FORMS_KEY.indexOf('PASTE')===-1;
    if(!hasKey){mailtoFallback(p);track('Lead');return;}
    sendBtn.disabled=true;sendBtn.textContent='Sending...';
    fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:CONFIG.WEB3FORMS_KEY,subject:'New Quote Request, '+(p.name||'Crystal Flow website'),from_name:'Crystal Flow Website','Service needed':p.service,'Town / location':p.town,'Name':p.name,'Phone':p.phone,'Prefers':p.prefer})})
      .then(function(r){return r.json();}).then(function(d){if(d&&d.success){track('Lead',{content_name:'Quote Request'});setStep(3);}else{mailtoFallback(p);}}).catch(function(){mailtoFallback(p);});
  });

  // ===== Drain severity quick-check (drain-cleaning page only) =====
  if(document.getElementById('sevResult')){
    var sevData={
      mild:{badge:'Low urgency',title:"Still moving, but don't wait too long.",body:"Slow drains are usually early buildup, grease, hair, or soap scum narrowing the pipe. A standard drain cleaning now is quick and inexpensive, way cheaper than waiting for a full clog.",service:"Slow drain, want it cleared before it turns into a full clog."},
      moderate:{badge:'Getting serious',title:"That's a warning sign, not a coincidence.",body:"Gurgling and drain smell usually mean a partial blockage further down the line, often past what a store snake can reach. Worth getting looked at this week before it becomes a backup.",service:"Gurgling pipes and drain smell, want it checked before it gets worse."},
      severe:{badge:'Call now',title:"That's an active backup. Stop running water.",body:"Standing water or water coming back up means the line is blocked and it needs attention today. Stop using that fixture, and call rather than wait for a callback.",service:"Active backup or standing water, need someone today."}
    };
    var sevCards=document.querySelectorAll('.sev-card');
    var sevResult=document.getElementById('sevResult');
    var sevBadge=document.getElementById('sevBadge');
    var sevTitle=document.getElementById('sevTitle');
    var sevBody=document.getElementById('sevBody');
    var sevSelectedService='';
    var reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sevCards.forEach(function(card){
      card.addEventListener('click',function(){
        var level=card.dataset.sev,d=sevData[level];
        if(!d)return;
        sevCards.forEach(function(c){c.classList.remove('active');c.setAttribute('aria-pressed','false');});
        card.classList.add('active');
        card.setAttribute('aria-pressed','true');
        sevBadge.textContent=d.badge;
        sevTitle.textContent=d.title;
        sevBody.textContent=d.body;
        sevSelectedService=d.service;
        sevResult.dataset.level=level;
        sevResult.hidden=false;
        sevResult.classList.remove('sev-fade');
        void sevResult.offsetWidth;
        sevResult.classList.add('sev-fade');
        sevResult.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'nearest'});
      });
    });
    document.getElementById('sevQuoteBtn').addEventListener('click',function(){
      var qs=document.getElementById('qService');
      if(qs&&sevSelectedService)qs.value=sevSelectedService;
    });
  }

  // ===== Fixture quick-check (mirrors drain-cleaning severity picker) =====
  var fixData={
    faucet:{badge:'Faucet trouble',title:"Usually a worn cartridge or seal, not a big job.",body:"Most faucet drips and leaks come down to a worn internal part. We repair it if the faucet has life left, or swap in a new one you pick, priced upfront either way.",service:"Faucet dripping or leaking, want it repaired or replaced."},
    toilet:{badge:'Toilet trouble',title:"Running toilets waste water every hour they run.",body:"A running or weak-flushing toilet is usually flapper, fill valve, or flush valve wear, quick fixes. Water at the base is a seal issue worth handling before it reaches the floor below.",service:"Toilet running, flushing weak, or leaking at the base."},
    sink:{badge:'Sink trouble',title:"Under-sink leaks do quiet damage fast.",body:"A slow drip under the vanity ruins the cabinet before you notice. We fix the trap, supply lines, or drain connections, or install the new sink and vanity you've picked out.",service:"Sink or vanity leaking underneath or needs replacement."},
    pipe:{badge:'Pipe trouble',title:"A line that keeps acting up has a root cause.",body:"Repeated leaks or clogs on the same drain line mean something's wrong at the source, worn pipe, bad slope, or a failing joint. We find it and fix that section right.",service:"Drain pipe worn or leaking, keeps having problems."}
  };
  var fixCards=document.querySelectorAll('.sev-card[data-fix]');
  var fixResult=document.getElementById('fixResult');
  if(fixResult&&fixCards.length){
    var fixBadge=document.getElementById('fixBadge');
    var fixTitle=document.getElementById('fixTitle');
    var fixBody=document.getElementById('fixBody');
    var fixSelectedService='';
    var fixReduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    fixCards.forEach(function(card){
      card.addEventListener('click',function(){
        var d=fixData[card.dataset.fix];
        if(!d)return;
        fixCards.forEach(function(c){c.classList.remove('active');c.setAttribute('aria-pressed','false');});
        card.classList.add('active');
        card.setAttribute('aria-pressed','true');
        fixBadge.textContent=d.badge;
        fixTitle.textContent=d.title;
        fixBody.textContent=d.body;
        fixSelectedService=d.service;
        fixResult.hidden=false;
        fixResult.classList.remove('sev-fade');
        void fixResult.offsetWidth;
        fixResult.classList.add('sev-fade');
        fixResult.scrollIntoView({behavior:fixReduceMotion?'auto':'smooth',block:'nearest'});
      });
    });
    document.getElementById('fixQuoteBtn').addEventListener('click',function(){
      var qs=document.getElementById('qService');
      if(qs&&fixSelectedService)qs.value=fixSelectedService;
    });
  }

  setStep(1);
})();
