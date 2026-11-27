(function(){
var root=document.documentElement,D=document,q=function(s){return D.querySelector(s)},qa=function(s,e){return [].slice.call((e||D).querySelectorAll(s))};
root.classList.add('js');var mq=matchMedia('(prefers-reduced-motion: reduce)'),reduce=mq.matches;mq.addEventListener('change',function(){location.reload()});
var mode=q('#mode');
/* dark lives in the address (#dark or #dark:place), so reload and Back keep it; nothing is stored */
var cross=qa('a[href^="/"],a[href^="#"]');cross.forEach(function(x){x._h=x.getAttribute('href')});
function dark(){return root.getAttribute('data-mode')==='dark'}
function parse(h){var m=/^#dark(?::(.+))?$/.exec(h);return m?{d:true,k:m[1]||''}:{d:false,k:h.slice(1)}}
function frag(k){return dark()?'#dark'+(k?':'+k:''):(k?'#'+k:'')}
function keep(k){history.replaceState(history.state,'',location.pathname+location.search+frag(k))}
function apply(d){root.setAttribute('data-mode',d?'dark':'light');mode.setAttribute('aria-pressed',d?'true':'false');cross.forEach(function(x){var h=x._h.split('#');x.setAttribute('href',d?h[0]+'#dark'+(h[1]?':'+h[1]:''):x._h)})}
function goTo(k){var t=k&&D.getElementById(k);if(t)t.scrollIntoView();return t}
var at=parse(location.hash),nav0=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{};apply(at.d);if(at.d&&at.k&&!/reload|back_forward/.test(nav0.type||''))goTo(at.k);
/* a new place in the address scrolls there; Back and Forward let the browser restore the scroll */
function seen(){history.replaceState({v:1},'',location.href)}seen();
addEventListener('hashchange',function(){var p=parse(location.hash),fresh=!(history.state&&history.state.v);if(p.d!==dark()){apply(p.d);if(cur)paint()}if(fresh){goTo(p.k);seen()}});
mode.addEventListener('click',function(){apply(!dark());keep(parse(location.hash).k);if(cur)paint()});
var lt=q('#litText'),words=[];if(lt){lt.innerHTML=lt.textContent.trim().split(/\s+/).map(function(w){return '<span class="w'+(/higher/.test(w)?' cu':'')+'">'+w+'</span>'}).join(' ');words=qa('.w',lt)}
var els=qa('[data-reveal], #chain');if('IntersectionObserver' in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.06});els.forEach(function(x){io.observe(x)})}else els.forEach(function(x){x.classList.add('in')});
var mart=q('#markart'),cap=q('#markcap');qa('details[data-part]').forEach(function(p){p.addEventListener('toggle',function(){if(p.open&&mart){mart.setAttribute('data-focus',p.getAttribute('data-part'));cap.textContent=p.getAttribute('data-cap')}})});
/* poses: x,y in % of the window, scale, turn, gap between the forms; from the top of a page to its end */
var P={home:[[17,2,1,0,0],[-16,-6,1.5,-14,10]],name:[[24,4,1.15,8,22],[-18,0,1.5,-6,0]],why:[[0,0,1.7,0,60],[0,0,1.05,0,0]],vision:[[20,16,1.7,-18,0],[-22,-8,1.2,10,26]],values:[[26,-14,1.2,14,0],[-24,14,1.5,-10,16]],mark:[[30,-16,.9,0,0],[26,18,1.3,20,0]],promise:[[-20,0,1.5,12,46],[0,0,1.25,0,0]]};
var bar=q('#bar'),art=q('#wart'),wa=q('#wa'),wb=q('#wb'),lit=q('#lit'),view=D.body.getAttribute('data-page'),cur=null,tgt=null,running=false,secs=[];
function clamp(v){return v<0?0:v>1?1:v}
function measure(){var y=scrollY,h=innerHeight,m=root.scrollHeight-h,t=m>0?clamp(y/m):0,p=P[view]||P.home;bar.classList.toggle('solid',y>40);
 tgt=p[0].map(function(a,i){return a+(p[1][i]-a)*t});if(lit){var r=lit.getBoundingClientRect(),sp=lit.offsetHeight-h;tgt.push(sp>0?clamp((h*.25-r.top)/(sp*.8+h*.1)):1)}else tgt.push(0);
 var tone=null;secs.forEach(function(s){var b=s.getBoundingClientRect();if(b.top<=h*.5&&b.bottom>h*.5)tone=s.getAttribute('data-t')});if(tone)root.setAttribute('data-tone',tone)}
function paint(){var c=cur,dk=root.getAttribute('data-mode')==='dark',nt=root.getAttribute('data-tone')==='night',rest=nt?.15:dk?.2:.13;art.style.opacity=view==='home'&&!nt&&!reduce?((dk?.23:.17)+(rest-(dk?.23:.17))*clamp(scrollY/innerHeight*1.3)).toFixed(3):rest;art.style.transform='translate3d(calc(-50% + '+(c[0]*innerWidth/100).toFixed(1)+'px),calc(-50% + '+(c[1]*innerHeight/100).toFixed(1)+'px),0) rotate('+c[3].toFixed(2)+'deg) scale('+c[2].toFixed(4)+')';wa.style.transform='translate3d('+(-c[4]).toFixed(1)+'px,0,0)';wb.style.transform='translate3d('+c[4].toFixed(1)+'px,0,0)';
 var n=c[5]*(words.length+1);for(var i=0;i<words.length;i++)words[i].style.transform=reduce?'none':'translate3d(0,'+(.07*(1-clamp(n-i))).toFixed(3)+'em,0)'}
var last=0;function loop(now){var f=last?Math.min((now-last)/16.7,4):1;last=now;var d=0;for(var i=0;i<6;i++){var k=tgt[i]-cur[i];cur[i]+=k*(1-Math.pow(1-(i===5?.25:.055),f));d=Math.max(d,Math.abs(k))}if(d<.004){cur=tgt.slice();paint();running=false;last=0;return}paint();requestAnimationFrame(loop)}
function kick(){measure();if(reduce){if(!cur)cur=(P[view]||P.home)[0].concat(1);paint();return}if(!cur)cur=tgt.slice();if(!running){for(var i=0,mv=false;i<6;i++)if(Math.abs(tgt[i]-cur[i])>.004)mv=true;if(!mv){paint();return}running=true;requestAnimationFrame(loop)}}
var queued=false;function later(){if(!queued){queued=true;requestAnimationFrame(function(){queued=false;kick()})}}addEventListener('scroll',later,{passive:true});addEventListener('resize',later);
var home=q('.home'),menu=q('#menu'),nav=q('#nav'),main=q('main'),foot=q('footer');
(function(){var n=D.createElement('button');n.type='button';n.className='menu';n.id='menu';n.textContent='Menu';n.setAttribute('aria-expanded','false');n.setAttribute('aria-controls','nav');menu.parentNode.replaceChild(n,menu);menu=n})();
function setMenu(o){nav.hidden=!o;menu.textContent=o?'Close':'Menu';menu.setAttribute('aria-expanded',o?'true':'false');D.body.classList.toggle('open',o);main.inert=foot.inert=home.inert=o}
menu.addEventListener('click',function(){var o=nav.hidden;setMenu(o);if(o)nav.querySelector('a').focus()});D.addEventListener('keydown',function(e){if(nav.hidden)return;if(e.key==='Escape'){setMenu(false);menu.focus();return}
 if(e.key!=='Tab')return;var f=[menu].concat(qa('a,button',nav)).filter(function(x){return x.offsetParent!==null||x===menu}),i=f.indexOf(D.activeElement);e.preventDefault();f[i<0?0:(i+(e.shiftKey?-1:1)+f.length)%f.length].focus()});
/* old links to the one long page still land in the right place */
if(view==='home'){var M={name:'/name/',why:'/why/',vision:'/vision/',mission:'/vision/#mission',values:'/values/',mark:'/mark/',help:'/promise/',heart:'/promise/#heart',promise:'/promise/#promise'},go=function(){var k=parse(location.hash).k;if(Object.prototype.hasOwnProperty.call(M,k)){var h=M[k].split('#');location.replace(h[0]+frag(h[1]))}};go();addEventListener('hashchange',go)}
/* same-page menu links: close, then move focus to the place they lead to */
function land(k){var t=D.getElementById(k);if(!t)return;var h=t.querySelector('h1,h2,h3')||t;h.setAttribute('tabindex','-1');t.scrollIntoView();h.focus({preventScroll:true})}
D.addEventListener('click',function(e){var x=e.target.closest&&e.target.closest('#nav a');if(!x||e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;var h=(x._h||'').split('#');if(h[1]&&h[0]===location.pathname){e.preventDefault();setMenu(false);history.pushState({v:1},'',frag(h[1])||location.pathname);land(h[1])}});
addEventListener('popstate',function(){if(!nav.hidden){setMenu(false);menu.focus()}});addEventListener('pageshow',function(e){if(!e.persisted)return;var was=!nav.hidden;setMenu(false);if(was)menu.focus()});
secs=qa('[data-t]');kick();
function allowed(t){return t&&t.closest&&t.closest('.contact')}['copy','cut','contextmenu','dragstart','selectstart'].forEach(function(ev){D.addEventListener(ev,function(e){var n=getSelection().anchorNode;if(!allowed(e.target)&&!(ev==='copy'&&allowed(n&&n.parentElement)))e.preventDefault()})});
function say(t){var z=q('#say');if(z)z.textContent=t}var btn=q('#copy'),addr=q('#addr');if(btn)btn.addEventListener('click',function(){function sel(){var r=D.createRange();r.selectNodeContents(addr);var s=getSelection();s.removeAllRanges();s.addRange(r);btn.textContent='Selected';say('Email address selected. Copy it now.')}try{navigator.clipboard.writeText(addr.textContent).then(function(){btn.textContent='Copied';say('Email address copied');setTimeout(function(){btn.textContent='Copy email'},2000)},sel)}catch(e){sel()}});
})();

(() => {
  function observeLanes() {
    if (!("IntersectionObserver" in window)) return;

    const narrow = window.matchMedia("(max-width: 55rem)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    document.querySelectorAll(".lane-section").forEach((section) => {
      const street = section.querySelector(".lane-apps");
      const houses = [...section.querySelectorAll(".lane-house")];
      if (!street || !houses.length) return;

      const seen = new Set();
      const observer = new IntersectionObserver((entries) => {
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting || reduced.matches) continue;

          observer.unobserve(target);

          if (target === street) {
            houses.forEach((house) => seen.add(house));
            street.setAttribute("data-lane-entered", "");
          } else {
            seen.add(target);
            target.closest(".lane-stop")?.setAttribute("data-lane-entered", "");
          }
        }
      }, { threshold: 0.12 });

      function observeLayout() {
        observer.disconnect();
        if (reduced.matches || seen.size === houses.length) return;

        if (!narrow.matches && seen.size === 0) {
          observer.observe(street);
          return;
        }

        houses.filter((house) => !seen.has(house)).forEach((house) => {
          observer.observe(house);
        });
      }

      narrow.addEventListener("change", observeLayout);
      reduced.addEventListener("change", observeLayout);
      observeLayout();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeLanes, { once: true });
  } else {
    observeLanes();
  }
})();
/* The Lane as collage: each app's words rise in as it arrives; its scene drifts gently (transform only).
   Without JS the words are simply shown; with reduced motion nothing moves. */
(() => {
  const apps = [...document.querySelectorAll(".lane-section .lane-app")];
  if (!apps.length) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduced) { apps.forEach((a) => a.classList.add("is-in")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.25 });
  apps.forEach((a) => io.observe(a));
  let raf = 0;
  const drift = () => {
    raf = 0;
    const H = window.innerHeight;
    for (const a of apps) {
      const r = a.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H) continue;
      const t = (r.top + r.height / 2 - H / 2) / H; // -1..1 around the middle of the screen
      a.style.setProperty("--lane-shift", (t * -40).toFixed(1) + "px");
    }
  };
  window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(drift); }, { passive: true });
  drift();
})();

