'use strict';
const story=window.BUSCADOS;
const seasons=[
 {name:'Cronos',color:'#efbb75',rgb:'239,187,117'},
 {name:'La montaña',color:'#9ce2f0',rgb:'156,226,240'},
 {name:'Campo Grande',color:'#ffae73',rgb:'255,174,115'}
];
const get=id=>document.getElementById(id);
const scene=get('catalog'),reader=get('reader'),tabs=get('seasons');
const pad=n=>String(n).padStart(2,'0');
const seasonLink=s=>'#temporada/'+s;
const chapterLink=(s,c)=>seasonLink(s)+'/capitulo/'+c;
function el(tag,cls,txt){const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;}
function link(href,txt,cls=''){const a=el('a',cls,txt);a.href=href;return a;}
function render({animate=true}={}){
 const m=location.hash.match(/^#temporada\/([1-3])(?:\/capitulo\/(\d+))?$/);
 const s=m?Number(m[1]):1, cs=story[s-1], c=m?Number(m[2]):0, book=cs[c-1], season=seasons[s-1];
 const root=document.documentElement;root.dataset.season=s;
 root.style.setProperty('--accent',season.color);root.style.setProperty('--rgb',season.rgb);root.style.setProperty('--land','url("assets/land'+s+'.webp")');
 tabs.replaceChildren(...seasons.map((_,i)=>{const a=link(seasonLink(i+1),'Temporada '+(i+1));if(i+1===s)a.setAttribute('aria-current','true');return a;}));
 scene.hidden=!!book;reader.hidden=!book;
 if(!book){
  reader.replaceChildren();
  const intro=el('section','intro');intro.append(el('h1','',season.name),el('p','','Elegí un capítulo'));
  const grid=el('div','grid'+(cs.length%2?' odd':''));
  cs.forEach((ep,i)=>{const a=link(chapterLink(s,i+1),'','crystal');a.setAttribute('aria-label','Capítulo '+(i+1)+': '+ep.title);
   a.style.setProperty('--tilt',[ '-2deg','1.5deg','1deg','-1.5deg'][i%4]);
   const gem=el('img','glass');gem.src='assets/crystal.webp';gem.alt='';gem.decoding='async';a.append(gem);
   const label=el('span','gemtext');label.append(el('span','number',pad(i+1)),el('span','name',ep.title));a.append(label);grid.append(a);
  });scene.replaceChildren(intro,grid);document.title='BUSCADOS · Temporada '+s;
 } else {
  const top=el('nav','readbar');top.setAttribute('aria-label','Volver a capítulos');top.append(link(seasonLink(s),'Volver a los capítulos','pill'));
  const paper=el('article','paper');paper.append(el('div','eyebrow','Temporada '+s+' · Capítulo '+pad(c)));
  const title=el('h1','',book.title);title.tabIndex=-1;paper.append(title);
  const script=el('div','script');
  for(const [kind,value] of book.blocks){
   if(kind==='image'){const fig=el('figure');const img=el('img');img.src=value;img.alt='Ilustración del capítulo '+c;img.loading='lazy';img.decoding='async';fig.append(img);script.append(fig);}
   else script.append(el('p',kind,value));
  }
  const end=el('nav','readend');end.setAttribute('aria-label','Continuar leyendo');
  end.append(c>1?link(chapterLink(s,c-1),'Capítulo anterior','pill'):link(seasonLink(s),'Ver capítulos','pill'));
  end.append(c<cs.length?link(chapterLink(s,c+1),'Próximo capítulo','pill'):s<3?link(seasonLink(s+1),'Temporada '+(s+1),'pill'):link(seasonLink(s),'Volver a Campo Grande','pill'));
  paper.append(script,end);reader.replaceChildren(top,paper);document.title=book.title+' · BUSCADOS';
  if(animate)title.focus({preventScroll:true});
 }
 const target=book?reader:scene;
 if(animate){
  window.scrollTo(0,0);
  target.classList.remove('arrive');void target.offsetWidth;target.classList.add('arrive');
  if(book&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   const v=el('div','veil');v.setAttribute('aria-hidden','true');document.body.append(v);setTimeout(()=>v.remove(),700);
  }
 }
}
window.addEventListener('hashchange',()=>render());
render({animate:false});
