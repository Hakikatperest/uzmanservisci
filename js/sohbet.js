/* Sohbet balonu: 6. saniyede bildirim sesi + "1" rozeti; hapa tıklayınca pencere açılır,
   "Görüşme başlat" WhatsApp'a gider. JS yoksa hap doğrudan WhatsApp linkidir. */
(function(){
  'use strict';
  var kutu=document.querySelector('.sb-hap-kutu'),pen=document.getElementById('sbPencere');
  if(!kutu||!pen)return;
  var hap=kutu.querySelector('.sb-hap'),rozet=kutu.querySelector('.sb-yeni'),
      yaziyor=pen.querySelector('.sb-yaziyor'),mesaj=pen.querySelector('.sb-mesaj'),
      saat=mesaj.querySelector('time'),git=pen.querySelector('.sb-git');
  var K='us-sohbet-v1',d={};
  try{d=JSON.parse(sessionStorage.getItem(K)||'{}')||{};}catch(e){}
  function yaz(){try{sessionStorage.setItem(K,JSON.stringify(d));}catch(e){}}
  if(!d.t0){d.t0=Date.now();yaz();}
  var ses=null,bekleyen=false;
  function cal(){
    if(d.ring)return;
    try{
      if(!ses){ses=new Audio('sounds/bildirim.mp3');ses.volume=.7;}
      var s=ses.play();
      if(s&&s.then){s.then(function(){d.ring=1;bekleyen=false;yaz();},function(){bekleyen=true;});}
    }catch(e){bekleyen=true;}
  }
  function dokunus(){if(bekleyen)cal();}
  document.addEventListener('pointerdown',dokunus,true);
  document.addEventListener('keydown',dokunus,true);
  function bildir(){
    if(d.read||pen.classList.contains('acik'))return;
    rozet.hidden=false;hap.setAttribute('aria-label','Su tesisatı ücretsiz danışma hattı: 1 yeni mesaj');cal();
  }
  function simdi(){var t=new Date();return ('0'+t.getHours()).slice(-2)+':'+('0'+t.getMinutes()).slice(-2);}
  var geldi=false;
  function ac(){
    pen.hidden=false;
    requestAnimationFrame(function(){requestAnimationFrame(function(){pen.classList.add('acik');});});
    rozet.hidden=true;d.read=1;yaz();
    hap.setAttribute('aria-expanded','true');hap.setAttribute('aria-label','Su tesisatı ücretsiz danışma hattı');
    if(!geldi){yaziyor.hidden=false;setTimeout(function(){yaziyor.hidden=true;saat.textContent=simdi();mesaj.hidden=false;geldi=true;},1300);}
    setTimeout(function(){try{git.focus({preventScroll:true});}catch(e){}},350);
  }
  function kapat(){
    pen.classList.remove('acik');hap.setAttribute('aria-expanded','false');
    setTimeout(function(){if(!pen.classList.contains('acik'))pen.hidden=true;},280);
  }
  function degistir(e){e.preventDefault();pen.classList.contains('acik')?kapat():ac();}
  hap.removeAttribute('href');hap.removeAttribute('target');hap.removeAttribute('rel');
  hap.setAttribute('role','button');hap.setAttribute('tabindex','0');hap.setAttribute('aria-haspopup','dialog');hap.setAttribute('aria-expanded','false');
  hap.addEventListener('click',degistir);
  hap.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')degistir(e);});
  pen.querySelector('.sb-kapat').addEventListener('click',kapat);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&pen.classList.contains('acik'))kapat();});
  if(!d.read){setTimeout(bildir,Math.max(0,6000-(Date.now()-d.t0)));}
})();
