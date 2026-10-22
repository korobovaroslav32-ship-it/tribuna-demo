const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const DAY=86400000;
const MONTHS=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const MON3=['ЯНВ','ФЕВ','МАР','АПР','МАЙ','ИЮН','ИЮЛ','АВГ','СЕН','ОКТ','НОЯ','ДЕК'];
const fd=t=>{const d=new Date(t);return d.getDate()+' '+MONTHS[d.getMonth()]};
const hm=t=>{const d=new Date(t);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
const ft=t=>fd(t)+', '+hm(t);
const ic=(n,c='')=>`<svg class="i ${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const money=n=>Number(n).toLocaleString('ru-RU').replace(/ /g,' ');

/* ---------- данные ---------- */
const SPORTS=['Футбол','Хоккей','Баскетбол','Волейбол','Теннис','Плавание','Лёгкая атлетика','Гимнастика','Единоборства','Биатлон'];
const STATUS=['Черновик','На согласовании','Утверждён'];
const PLANS=[
 {id:'m1',t:'1 месяц',price:20,per:'20 BYN за месяц',note:'Попробовать'},
 {id:'m3',t:'3 месяца',price:54,per:'18 BYN в месяц',note:'Учебный сезон'},
 {id:'y1',t:'12 месяцев',price:180,per:'15 BYN в месяц',note:'Год',best:1}
];
/*@baza:start*//*@baza:end*/
const SRC=BAZA.sources;const COURSES=BAZA.courses;
const LESSONS=COURSES.flatMap(c=>c.lessons.map(l=>({...l,c:c.id})));
const lesson=id=>LESSONS.find(l=>l.id===id);
function seed(){
  const now=Date.now(), t0=new Date(); t0.setHours(19,0,0,0);
  const at=d=>t0.getTime()+d*DAY;
  const pp=[
   ['Анна Лис','Хоккей','Минск',[11,12],{u:now+12*DAY}],
   ['Сергей Ковальчук','Футбол','Брест',[11,12,13,14,51],{u:now+40*DAY}],
   ['Ольга Рудак','Плавание','Гомель',[11],{u:now+5*DAY}],
   ['Игорь Савич','Футбол','Минск',[],{u:null,pend:'m3'}],
   ['Марина Громова','Теннис','Минск',[11,12],{u:now+200*DAY}],
   ['Павел Зуйко','Баскетбол','Гродно',[11,12,13,14,21,31],{u:now+3*DAY}],
   ['Елена Бондарь','Волейбол','Витебск',[],{u:null}],
   ['Дмитрий Мороз','Биатлон','Раубичи',[11],{u:now-4*DAY}],
   ['Наталья Янович','Гимнастика','Могилёв',[11,12],{u:now+25*DAY}],
   ['Виктор Шило','Единоборства','Минск',[11,12,13,14],{u:now+80*DAY}],
   ['Татьяна Лапко','Лёгкая атлетика','Брест',[11],{u:null,pend:'m1'}],
   ['Андрей Гусев','Футбол','Гомель',[],{u:now+9*DAY}]
  ];
  const parents=pp.map(([n,sp,city,d,s],i)=>({id:'p'+i,no:i+1,n,sport:sp,city,d,until:s.u,pend:s.pend||null,reg:[],rem:[],fam:[],club:null,certAt:null}));
  parents.forEach((p,i)=>{if(certified(p))p.certAt=now-(20+i*7)*DAY});parents[0].fam=['Олег Лис'];parents[1].club='c2';parents[9].club='c1';
  parents[1].reg=[1,2];parents[4].reg=[1];parents[5].reg=[2];parents[8].reg=[1,4];parents[9].reg=[1];
  return {
    parents,rev:1240,
    clubs:[{id:'c1',n:'СДЮШОР «Северный лёд»',city:'Минск',sport:'Хоккей',code:'LED-2026',codes:40,used:31,certs:18},{id:'c2',n:'ДЮСШ «Старт»',city:'Брест',sport:'Футбол',code:'START-26',codes:25,used:12,certs:7},{id:'c3',n:'Клуб плавания «Волна»',city:'Гомель',sport:'Плавание',code:'VOLNA-26',codes:20,used:4,certs:1}],
    news:[{k:'Курс',t:'Новые курсы: «Безопасность ребёнка в спорте» и «Талант и отбор»',d:-1,course:6},{k:'Урок',t:'Новый урок «Родитель и тренер»',d:-3,go:14},{k:'Событие',t:'Открыта запись: «Хоккей: травмы и профилактика»',d:-5},{k:'Запись',t:'Запись вебинара «Сон и восстановление юного спортсмена»',d:-15}],
    status:Object.fromEntries(Object.entries(BAZA.status).map(([k,v])=>[+k,v])),
    events:[
      {id:1,type:'Вебинар',t:'Как говорить с тренером',sport:'all',at:at(11),link:'ссылка на вебинар появится за час до начала',rec:false},
      {id:2,type:'Семинар',t:'Подросток в большом спорте. Очно в Минске',sport:'all',at:at(25),link:'очно, адрес сообщим после записи',rec:false},
      {id:3,type:'Вебинар',t:'Сон и восстановление юного спортсмена',sport:'all',at:at(-17),link:'',rec:true},
      {id:4,type:'Вебинар',t:'Хоккей: травмы и профилактика',sport:'Хоккей',at:at(18),link:'ссылка на вебинар появится за час до начала',rec:false}
    ],
    nextE:5
  };
}
let D=seed();
const S={role:null,view:'landing',course:null,lesson:null,quiz:{},sport:'all',plan:null,uf:'all'};
const me=()=>D.parents.find(p=>p.id==='p0');
const active=p=>!!p.until&&p.until>Date.now();
const courseOpen=c=>D.status[c.id]===2;
function certified(p){return COURSES[0].lessons.every(l=>p.d.includes(l.id))}
const certNo=p=>'ТРБ-26-'+String(p.no).padStart(4,'0');
const canLesson=(m,c,i)=>active(m)||i===0||(!!m.club&&!!c.cert);
const clubOf=p=>p.club&&D.clubs.find(c=>c.id===p.club);
const sportOk=x=>x.sport==='all'||S.sport==='all'||x.sport===S.sport;
function toast(t){const e=$('#toast');e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,2200)}
function go(v,o){S.view=v;Object.assign(S,o||{});render();window.scrollTo({top:0,behavior:'instant'})}
const upcoming=()=>D.events.filter(e=>e.at>Date.now()&&sportOk(e));
const initials=n=>n.split(' ').map(w=>w.replace(/[^А-ЯA-Zа-яa-zЁё]/g,'')[0]).filter(Boolean).join('').slice(0,2).toUpperCase();
const hello=()=>{const h=new Date().getHours();return h<5?'Доброй ночи':h<12?'Доброе утро':h<18?'Добрый день':'Добрый вечер'};

/* ---------- каркас ---------- */
const NAV={
  parent:[['home','Главная','grid'],['courses','Курсы','book'],['events','События','cal'],['profile','Кабинет','user']],
  admin:[['dash','Обзор','grid'],['users','Подписчики','users'],['clubs','Клубы','shield'],['aevents','Расписание','cal'],['content','Материалы','book']]
};
const MARK='<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 21a10 10 0 0 1 20 0"/><path d="M8.5 21a5.5 5.5 0 0 1 11 0"/><path d="M3 24.5h22"/></svg>';
const logo=(to)=>`<button class="logo" data-go="${to}" aria-label="Трибуна, на главную"><span class="mk">${MARK}</span><span><b>ТРИБУНА</b><small>Для родителей</small></span></button>`;
const DEMO='<p class="demo">Интерактивный макет: оплата условная, данные только в вашем браузере, имена вымышленные. Цены, цифры и тексты уроков — примеры.</p>';
const LINES='<svg class="lines" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#FFD21F" stroke-opacity=".16" stroke-width="2.5" aria-hidden="true"><rect x="60" y="60" width="1320" height="580" rx="10"/><line x1="720" y1="60" x2="720" y2="640"/><circle cx="720" cy="350" r="120"/><rect x="60" y="215" width="170" height="270"/><rect x="1210" y="215" width="170" height="270"/><path d="M230 290a80 80 0 0 1 0 120M1210 290a80 80 0 0 0 0 120"/></svg>';
function shell(body){
  const cur=S.view==='course'||S.view==='lesson'?'courses':S.view==='plans'||S.view==='pay'?'profile':S.view;
  const par=S.role==='parent',m=me();
  const days=par&&active(m)?Math.ceil((m.until-Date.now())/DAY):0;
  const pend=D.parents.filter(p=>p.pend).length;
  const to=par?'home':'dash';
  return `<div class="shell"><aside class="side">${logo(to)}
   <nav class="nav" aria-label="Разделы">${NAV[S.role].map(([k,t,i])=>`<button data-go="${k}" ${cur===k?'aria-current="page"':''}>${ic(i)}<span>${t}</span></button>`).join('')}</nav>
   <div class="ucard"><div class="top"><span class="av">${par?initials(m.n):'ОР'}</span><div><p class="nm">${par?esc(m.n):'Организатор'}</p><p class="eyebrow" style="margin:2px 0 0;font-size:12px;letter-spacing:.1em">${par?esc(m.sport):'Админ-кабинет'}</p></div><button class="out" data-act="out" aria-label="Выйти">${ic('out')}</button></div>
   ${par?`<p class="lv">${active(m)?'Подписка активна':m.pend?'Оплата проверяется':m.club?'Доступ от клуба':'Без подписки'}</p>${m.certAt?`<p class="xp" style="color:var(--mint)">Сертификат ${certNo(m)}</p>`:''}<div class="prog" style="margin-top:8px"><i style="width:${Math.min(100,days/30*100)}%"></i></div><p class="xp">${active(m)?`осталось ${days} дн. · до ${fd(m.until)}`:m.club?'базовый курс и сертификат открыты':'открыт первый урок каждого курса'}</p>`:`<p class="lv">${pend?pend+' оплат ждут':'Всё подтверждено'}</p><p class="xp">${D.parents.filter(active).length} активных подписок</p>`}</div></aside>
  <main class="main" id="main">${DEMO}<div class="mtop">${logo(to)}<button class="btn ghost sm" data-act="out">Выйти</button></div>${body}</main></div>`}
function pubTop(){
  return `<header class="pub-top ${S.view==='landing'?'over':''}"><div class="pub-in">${logo('landing')}<nav aria-label="Разделы">${S.view==='landing'?[['#courses','Курсы'],['#events','События'],['#clubs','Клубам'],['#plans','Тарифы'],['#faq','Вопросы']].map(([k,t])=>`<button data-scroll="${k}">${t}</button>`).join(''):''}</nav><button class="btn sm" data-go="login">Войти</button></div></header>`}
const head=(eb,t,acts='')=>`<div class="head"><div><p class="eyebrow">${eb}</p><h1>${t}</h1></div>${acts?`<div class="acts">${acts}</div>`:''}</div>`;

/* ---------- общие блоки ---------- */
const chipsHTML=(list)=>`<div class="chips" role="group" aria-label="Вид спорта"><button class="chip" aria-pressed="${S.sport==='all'}" data-sport="all">Все</button>${list.map(s=>`<button class="chip" aria-pressed="${S.sport===s}" data-sport="${esc(s)}">${esc(s)}</button>`).join('')}</div>`;
function plansBlock(cta){return `<div class="plans">${PLANS.map(p=>`<div class="card plan ${p.best?'best':''}">${p.best?'<span class="stamp">Выгоднее всего</span>':''}<p class="eyebrow">${p.note}</p><h3>${p.t}</h3><div class="price">${p.price}<small>BYN</small></div><p class="small muted">${p.per}</p>
 <ul><li>Все курсы и уроки</li><li>Запись на семинары и вебинары</li><li>Записи прошедших вебинаров</li></ul>
 <button class="btn ${p.best?'':'ghost'}" style="margin-top:auto" data-plan="${p.id}">${cta}</button></div>`).join('')}</div>`}
function lockBox(){return `<div class="card lock mt"><div><h3>Доступ по подписке</h3><p class="small muted" style="margin-top:4px">Первый урок каждого курса открыт бесплатно. Остальное — подписчикам.</p></div><button class="btn" data-go="plans">Выбрать подписку</button></div>`}
function statusPill(p){return active(p)?`<span class="pill ok">до ${fd(p.until)}</span>`:p.pend?'<span class="pill wait">Ждёт подтверждения</span>':p.until?'<span class="pill bad">Истекла</span>':'<span class="pill">Нет подписки</span>'}
const mins=c=>c.lessons.reduce((a,l)=>a+l.min,0);
const author=c=>`<div class="au"><span class="av">${initials(c.by)}</span><p class="small"><b>${esc(c.by)}</b><br><span class="muted">по материалам: ${esc(c.basis)}</span></p></div>`;
const evDate=e=>{const d=new Date(e.at);return `<div class="date"><b>${d.getDate()}</b><span>${MON3[d.getMonth()]}</span></div>`};
const ring=(pct,size=84)=>{const r=size/2-8,c=2*Math.PI*r;return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${pct}%" style="flex:none"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE36B"/><stop offset="1" stop-color="#FFC400"/></linearGradient></defs><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#232725" stroke-width="8"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="url(#rg)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${c*pct/100} ${c}" transform="rotate(-90 ${size/2} ${size/2})"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="Manrope Variable,Manrope,sans-serif" font-weight="750" font-size="${size/4.2}" fill="#F3F0E8">${pct}%</text></svg>`};

/* ---------- лендинг ---------- */
function vLanding(){
  const cs=COURSES.filter(c=>courseOpen(c)&&sportOk(c)).length, up=upcoming().sort((a,b)=>a.at-b.at), ev=up.length;
  const e0=up[0];
  return `
 <section class="story" id="story" aria-label="Как работает Трибуна">
  <div class="stage" id="stage"><div class="poster" aria-hidden="true">${LINES}</div>
   <div class="hud" aria-hidden="true"><span id="hud-n"><b>01</b> / 05</span><div class="bar"><i id="hud-bar"></i></div><span class="hint"><i></i>листайте</span></div></div>
  <div class="steps">
   <article class="step on"><div class="in"><p class="stepchip"><b>01</b>Для родителей · вся Беларусь</p>
    <h1>Родители — <em>часть команды</em></h1>
    <p class="lead">Курсы, вебинары и сертификат для родителей юных спортсменов. Любой вид спорта, любой город, оплата через ЕРИП.</p>
    <div class="acts"><button class="btn" data-scroll="#plans">Смотреть тарифы ${ic('arrow')}</button><button class="btn ghost glass" data-act="enter-new">Войти без подписки</button></div></div></article>
   <article class="step"><div class="in"><p class="stepchip"><b>02</b>Курсы</p>
    <h2>Уроки <em>по 5 минут</em></h2>
    <p class="lead">По материалам Sport Parent EU, CDC и Positive Coaching Alliance. После урока — вопрос-проверка и два вопроса ребёнку «обсудите дома».</p>
    <div class="gstats"><div class="glass"><b>${cs}</b><span>курсов</span></div><div class="glass"><b>${LESSONS.filter(l=>l.q).length}</b><span>уроков</span></div><div class="glass"><b>1-й</b><span>урок бесплатно</span></div></div></div></article>
   <article class="step"><div class="in"><p class="stepchip"><b>03</b>Вебинары и семинары</p>
    <h2>Эксперты <em>в прямом эфире</em></h2>
    <p class="lead">Запись одной кнопкой, напоминание за день, записи прошедших эфиров в архиве.</p>
    ${e0?`<div class="glass gcard">${evDate(e0)}<div><p class="eyebrow">${e0.type} · ${hm(e0.at)}</p><b>${esc(e0.t)}</b></div></div>`:''}</div></article>
   <article class="step"><div class="in"><p class="stepchip"><b>04</b>Сертификат</p>
    <h2>Номер, который <em>проверит тренер</em></h2>
    <p class="lead">Базовый курс за 20 минут — и у вас сертификат родителя. Клубы покупают коды для всех семей команды.</p>
    <div class="glass gcard"><span class="ic gold">${ic('shield')}</span><div><p class="eyebrow">Сертификат родителя</p><p class="num">ТРБ-26-0002</p></div><span class="pill ok" style="margin-left:auto">действителен</span></div></div></article>
   <article class="step"><div class="in"><p class="stepchip"><b>05</b>Сезон</p>
    <h2>Ваш план <em>на сезон</em></h2>
    <div class="gplan">${PLANS.map(p=>`<div class="glass"><b>${p.price} BYN</b><span>${p.t}</span></div>`).join('')}</div>
    <div class="acts"><button class="btn" data-scroll="#plans">Выбрать подписку ${ic('arrow')}</button><button class="btn ghost glass" data-scroll="#clubs">Для клубов</button></div></div></article>
  </div></section><!--/story-->

 <section class="sec"><div class="grid g4" style="gap:14px">
  <button class="tile" data-scroll="#courses"><span class="ic">${ic('book')}</span><span><b>${cs} ${cs===1?'курс':'курсов'}</b><span class="s">первый урок бесплатно</span></span></button>
  <button class="tile" data-scroll="#events"><span class="ic">${ic('cal')}</span><span><b>${ev} ${ev===1?'событие':'событий'} впереди</b><span class="s">семинары и вебинары</span></span></button>
  <button class="tile" data-scroll="#plans"><span class="ic">${ic('wallet')}</span><span><b>от 15 BYN в месяц</b><span class="s">1, 3 или 12 месяцев</span></span></button>
  <button class="tile" data-act="enter-new"><span class="ic">${ic('user')}</span><span><b>Войти в макет</b><span class="s">без пароля</span></span></button>
 </div></section>

 <section class="sec" id="courses"><div class="sec-h"><div><p class="eyebrow">Библиотека</p><h2>Курсы</h2></div><p>Выберите вид спорта: список покажет общие курсы и курсы именно для него.</p></div>
  ${chipsHTML(SPORTS)}
  <div class="grid g2 mt">${COURSES.filter(sportOk).map(c=>`<div class="card cc"><div class="top"><span class="ic">${ic('book')}</span><span class="pill ${c.sport==='all'?'rev':'ok'}">${c.sport==='all'?'Все виды спорта':esc(c.sport)}</span></div><h3>${esc(c.t)}</h3><p>${esc(c.about)}</p>${author(c)}<div class="foot"><span class="small muted">${c.lessons.length} ур. · ${mins(c)} мин${courseOpen(c)?'':' · скоро'}</span>${c.cert?'<span class="pill ok">Сертификат</span>':''}</div></div>`).join('')||'<div class="card"><p class="muted">Курсы для этого вида спорта готовятся.</p></div>'}</div></section>

 <section class="sec" id="events"><div class="sec-h"><div><p class="eyebrow">Афиша</p><h2>Ближайшие семинары и вебинары</h2></div><p>Запись открыта подписчикам.</p></div>
  <div class="grid g2">${up.map(e=>`<div class="card ev">${evDate(e)}<div><p class="eyebrow" style="margin-bottom:4px">${e.type} · ${hm(e.at)}</p><h3>${esc(e.t)}</h3><p class="small muted">${e.sport==='all'?'Для всех видов спорта':esc(e.sport)}</p></div></div>`).join('')||'<div class="card"><p class="muted">Для этого вида спорта событий пока нет.</p></div>'}</div></section>

 <section class="sec" id="clubs"><div class="sec-h"><div><p class="eyebrow">Клубам и федерациям</p><h2>Сертифицированные родители в каждой команде</h2></div><p>Клуб покупает коды, родители проходят базовый курс и получают сертификат.</p></div>
  <div class="grid g-main"><div class="card club-pack"><div class="grid g3" style="gap:14px">
   <div><span class="ic">${ic('card')}</span><h3 style="margin:12px 0 6px">Коды доступа</h3><p class="small muted">Один код на семью. Клуб раздаёт их при записи ребёнка в секцию.</p></div>
   <div><span class="ic">${ic('shield')}</span><h3 style="margin:12px 0 6px">Сертификат родителя</h3><p class="small muted">Выдаётся после курса «Родитель на трибуне», около 20 минут.</p></div>
   <div><span class="ic">${ic('users')}</span><h3 style="margin:12px 0 6px">Отчёт клубу</h3><p class="small muted">Сколько семей активировали код и получили сертификат.</p></div></div>
   <div class="club-price"><div><p class="eyebrow">Пакет клуба</p><p class="price-l">12 <small>BYN за семью</small></p><p class="small muted">от 20 семей · полная подписка для семей клуба со скидкой 20%</p></div><button class="btn" data-toast="Заявка отправлена (демо). Мы свяжемся с клубом.">Оставить заявку ${ic('arrow')}</button></div></div>
  <div class="card"><form id="cert-form"><p class="eyebrow">Проверка сертификата</p><h3 style="margin-bottom:6px">Тренеру и администратору</h3><p class="small muted" style="margin-bottom:14px">Введите номер, например ТРБ-26-0002.</p>
   <div class="f"><label for="cert-n">Номер сертификата</label><input type="text" id="cert-n" placeholder="ТРБ-26-0000" autocomplete="off" value="${esc(S.certQ||'')}"></div>
   <button class="btn ghost" type="submit">Проверить</button>${certResult()}</form></div></div></section>

 <section class="sec" id="plans"><div class="sec-h"><div><p class="eyebrow">Подписка</p><h2>Один тариф даёт доступ ко всему</h2></div><p>Курсы, запись на события и записи вебинаров.</p></div>
  ${plansBlock('Выбрать')}<p class="small muted" style="margin-top:14px">Цены в макете — пример. Оплата по реквизитам или через ЕРИП, организатор подтверждает платёж.</p></section>

 <section class="sec" id="faq"><div class="sec-h"><div><p class="eyebrow">Вопросы</p><h2>Что родители спрашивают перед оплатой</h2></div></div>
  <details><summary>Нужно ли указывать данные ребёнка?</summary><p>Нет. Платформа хранит только данные родителя: имя, email, вид спорта и город.</p></details>
  <details><summary>Можно ли посмотреть до оплаты?</summary><p>Да, первый урок каждого курса открыт бесплатно, а расписание событий видно всем.</p></details>
  <details><summary>Как оплатить?</summary><p>По реквизитам или через ЕРИП. После оплаты нажмите «Я оплатил(а)», организатор подтвердит платёж и откроет доступ.</p></details>
  <details><summary>Где хранятся данные и видео?</summary><p>На серверах в Беларуси. Вебинары проходят во внешнем сервисе, на платформе остаются ссылка и запись.</p></details>
  <details><summary>Подойдёт ли платформа для моего вида спорта?</summary><p>Общие курсы подходят всем. Курсы по отдельным видам спорта добавляются по мере появления экспертов.</p></details></section>

 <section class="sec card cta hero" style="border-radius:28px"><div class="in" style="padding:0"><h2>Выходим на поле вместе</h2><div class="acts"><button class="btn" data-scroll="#plans">Выбрать подписку</button><button class="btn ghost" data-go="login">Войти</button></div></div></section>
 <footer>Трибуна · платформа для родителей юных спортсменов Беларуси · интерактивный макет. Имена, цифры, цены и тексты уроков вымышлены.</footer>`}
function certResult(){const q=(S.certQ||'').trim().toUpperCase().replace(/\s/g,'');if(!q)return '';const p=D.parents.find(x=>x.certAt&&certNo(x)===q);
  return p?`<div class="cert-res ok">${ic('check')}<div><b>Действителен</b><p class="small">${esc(p.n.split(' ')[0])} ${esc(p.n.split(' ')[1][0])}. · выдан ${fd(p.certAt)}</p></div></div>`:`<div class="cert-res bad">${ic('lock')}<div><b>Не найден</b><p class="small">Проверьте номер или спросите родителя.</p></div></div>`}
function vLogin(){return `<div style="max-width:880px;margin:24px auto 0">${head('Вход в макет','Выберите, кем зайти')}<p class="muted" style="margin:-10px 0 20px">В макете вход без пароля.</p>
 <div class="grid g3">
 <div class="card"><span class="ic">${ic('user')}</span><h3 style="margin:14px 0 6px">Родитель</h3><p class="small muted" style="margin-bottom:16px">Анна Лис, хоккей, Минск. Подписка активна.</p><button class="btn" data-act="enter-parent">Войти</button></div>
 <div class="card"><span class="ic">${ic('lock')}</span><h3 style="margin:14px 0 6px">Без подписки</h3><p class="small muted" style="margin-bottom:16px">Видит, что закрыто, и оформляет подписку.</p><button class="btn ghost" data-act="enter-new">Войти</button></div>
 <div class="card"><span class="ic">${ic('shield')}</span><h3 style="margin:14px 0 6px">Организатор</h3><p class="small muted" style="margin-bottom:16px">Подтверждает оплату, ведёт расписание.</p><button class="btn ghost" data-act="enter-admin">Войти</button></div></div>
 <div class="card mt"><form id="code-form" class="code-row"><div style="flex:1;min-width:220px"><p class="eyebrow">Код от клуба</p><h3>Клуб выдал вам код?</h3><p class="small muted">Код открывает базовый курс и сертификат. Для проверки: <b class="gold">LED-2026</b>.</p></div><div class="f" style="margin:0;flex:1;min-width:200px"><label for="club-code">Код</label><input type="text" id="club-code" placeholder="LED-2026" autocomplete="off"></div><button class="btn" type="submit">Активировать</button></form></div></div>`}
function vPlans(){return `${head('Подписка','Выберите срок')}<p class="muted" style="margin:-10px 0 22px">Оплата в макете условная.</p>${plansBlock(S.role?'Оформить':'Войти и оформить')}`}
function vPay(){
  const p=PLANS.find(x=>x.id===S.plan)||PLANS[1];
  return `<button class="btn ghost sm" data-go="plans">← К тарифам</button>${head('Оплата',`${p.t}, ${p.price} BYN`)}
  <div class="card" style="max-width:720px"><div class="pay" style="margin-top:0"><p><b>Как будет в рабочей версии.</b> Вы платите по реквизитам или через ЕРИП и нажимаете «Я оплатил(а)». Организатор подтверждает платёж, срок подписки продлевается. Позже сюда можно поставить онлайн-оплату картой.</p>
  <p class="small muted" style="margin-block:12px 16px">Реквизиты — пример: получатель [название], УНП [номер], назначение платежа «Подписка, ${esc(me().n)}».</p>
  <button class="btn" data-pay="${p.id}">Я оплатил(а) (демо)</button></div></div>`}

/* ---------- родитель ---------- */
function vHome(){
  const m=me(),all=LESSONS.filter(l=>courseOpen(COURSES.find(c=>c.id===l.c))&&l.q),done=all.filter(l=>m.d.includes(l.id)).length;
  const next=all.find(l=>!m.d.includes(l.id)), nc=next&&COURSES.find(c=>c.id===next.c);
  const cl=nc?nc.lessons.filter(l=>l.q):[], cd=cl.filter(l=>m.d.includes(l.id)).length;
  const ev=D.events.filter(e=>e.at>Date.now()&&(e.sport==='all'||e.sport===m.sport)).sort((a,b)=>a.at-b.at);
  const days=active(m)?Math.ceil((m.until-Date.now())/DAY):0, nd=ev[0]?Math.ceil((ev[0].at-Date.now())/DAY):0;
  const mine=COURSES.filter(c=>courseOpen(c)&&(c.sport==='all'||c.sport===m.sport));
  const base=COURSES[0],bd=base.lessons.filter(l=>m.d.includes(l.id)).length;
  return `<section class="hero"><div>${LINES}</div><div class="in">
   <div class="hello"><span class="av">${initials(m.n)}</span><p class="eyebrow">${esc(m.sport)} · ${esc(m.city)}${active(m)?' · подписка активна':m.club?' · доступ от клуба':''}</p>${m.certAt?`<span class="pill ok">Сертифицированный родитель</span>`:''}</div>
   <div class="home-hero"><div><h1>${hello()}, <em>${esc(m.n.split(' ')[0])}</em></h1>
   <p class="lead">${next?`Следующий урок — «${esc(next.t)}», ${next.min} мин. ${ev[0]?`Ближайшее событие: ${esc(ev[0].t)}, ${ft(ev[0].at)}.`:''}`:'Все доступные уроки пройдены. Загляните в расписание событий.'}</p></div>
   ${next?`<button class="btn" data-lesson="${next.id}">Продолжить урок ${ic('arrow')}</button>`:`<button class="btn" data-go="events">К событиям ${ic('arrow')}</button>`}</div></div></section>
  <div class="grid g4 mt" style="gap:14px">
   <button class="tile" ${next?`data-lesson="${next.id}"`:'data-go="courses"'}><span class="ic">${ic('play')}</span><span><b>Продолжить урок</b><span class="s">${next?esc(next.t):'всё пройдено'}</span></span></button>
   <button class="tile" data-go="events"><span class="ic">${ic('cal')}</span><span><b>Записаться на вебинар</b><span class="s">${ev[0]?ft(ev[0].at):'пока нет событий'}</span></span></button>
   <button class="tile" data-go="events"><span class="ic">${ic('film')}</span><span><b>Записи вебинаров</b><span class="s">${D.events.filter(e=>e.rec).length} в архиве</span></span></button>
   <button class="tile" data-go="profile"><span class="ic">${ic('card')}</span><span><b>Моя подписка</b><span class="s">${active(m)?'до '+fd(m.until):'не оформлена'}</span></span></button></div>
  ${active(m)?'':`<div class="card lock mt"><div><h3>${m.pend?'Оплата проверяется':'Подписка не оформлена'}</h3><p class="small muted" style="margin-top:4px">${m.pend?'Организатор подтвердит оплату, и откроются все материалы.':'Открыт только первый урок каждого курса.'}</p></div>${m.pend?'':'<button class="btn" data-go="plans">Выбрать подписку</button>'}</div>`}
  <div class="grid g2 mt">${nc?`<div class="card" style="display:flex;flex-wrap:wrap;gap:16px 24px;align-items:center;justify-content:space-between"><div style="flex:1;min-width:240px"><p class="eyebrow">Текущий курс · ${esc(nc.t)}</p><h3 style="font-size:1.2rem;margin-bottom:12px">Урок ${Math.min(cd+1,cl.length)} из ${cl.length} · <span class="gold">${Math.round(cd/cl.length*100)}%</span></h3><div class="prog"><i style="width:${cd/cl.length*100}%"></i></div></div><button class="btn" data-course="${nc.id}">К курсу ${ic('arrow')}</button></div>`:''}${m.certAt?`<div class="card cert-mini"><span class="ic gold">${ic('shield')}</span><div style="flex:1"><p class="eyebrow">Сертификат родителя</p><h3>${certNo(m)}</h3><p class="small muted">выдан ${fd(m.certAt)} · покажите номер тренеру</p></div><button class="btn ghost sm" data-go="profile">Открыть</button></div>`:`<div class="card cert-mini"><span class="ic">${ic('shield')}</span><div style="flex:1"><p class="eyebrow">До сертификата родителя</p><h3>${base.lessons.length-bd} ${base.lessons.length-bd===1?'урок':'урока'} курса «${esc(base.t)}»</h3><div class="prog" style="margin-top:10px"><i style="width:${bd/base.lessons.length*100}%"></i></div></div><button class="btn sm" data-course="${base.id}">Пройти</button></div>`}</div>
  <div class="grid g3 mt" style="gap:14px">
   <div class="card kpi"><div class="row1"><span class="eyebrow">Пройдено уроков</span>${ic('check')}</div><p class="v">${done}<small>из ${all.length}</small></p><p class="d">${all.length-done} впереди</p></div>
   <div class="card kpi ${days&&days<8?'warn':''}"><div class="row1"><span class="eyebrow">Дней подписки</span>${ic('clock')}</div><p class="v">${days}<small>дн.</small></p><p class="d">${active(m)?'до '+fd(m.until):'подписка не активна'}</p></div>
   <div class="card kpi"><div class="row1"><span class="eyebrow">До ближайшего события</span>${ic('cal')}</div><p class="v">${ev[0]?nd:'—'}<small>${ev[0]?'дн.':''}</small></p><p class="d">${ev[0]?esc(ev[0].t):'расписание пополнится'}</p></div></div>
  <div class="grid g2 mt"><div class="card"><p class="eyebrow">Новое в ${MONTHS[new Date().getMonth()].replace(/я$/,'е').replace(/а$/,'е')}</p>${D.news.map(n=>`<div class="row"><span class="pill ${n.k==='Урок'?'ok':n.k==='Событие'?'wait':'rev'}">${n.k}</span><div class="t"><p class="small"><b>${esc(n.t)}</b></p><p class="small muted">${fd(Date.now()+n.d*DAY)}</p></div>${n.course?`<button class="btn ghost sm" data-course="${n.course}">Открыть</button>`:n.go?`<button class="btn ghost sm" data-lesson="${n.go}">Открыть</button>`:`<button class="btn ghost sm" data-go="events">Смотреть</button>`}</div>`).join('')}</div><div class="card"><p class="eyebrow">Расписание</p><h3 style="margin-bottom:6px">Ближайшие события</h3>${ev.slice(0,3).map(e=>`<div class="row">${evDate(e)}<div class="t"><p><b>${esc(e.t)}</b></p><p class="small muted">${e.type} · ${hm(e.at)}</p></div></div>`).join('')||'<p class="muted small">Пока нет.</p>'}<button class="btn ghost sm" style="margin-top:8px" data-go="events">Все события</button></div></div>
  <div class="mt"><div class="card"><p class="eyebrow">Для вашего вида спорта · ${esc(m.sport)}</p><h3 style="margin-bottom:6px">Доступные курсы</h3>${mine.map(c=>`<div class="row"><span class="num">${c.lessons.length}</span><div class="t"><p><b>${esc(c.t)}</b></p><p class="small muted">${c.sport==='all'?'для всех видов спорта':esc(c.sport)}</p></div><button class="btn ghost sm" data-course="${c.id}">Открыть</button></div>`).join('')}</div></div>`}

function vCourses(){
  const m=me();
  return `${head('Библиотека','Курсы')}${chipsHTML([...new Set(COURSES.map(c=>c.sport).filter(x=>x!=='all'))])}
  <div class="grid g2 mt">${COURSES.filter(sportOk).map(c=>{const ls=c.lessons,dn=ls.filter(l=>m.d.includes(l.id)).length,open=courseOpen(c);
   return `<div class="card cc"><div class="top"><span class="ic">${ic('book')}</span><span class="pill ${c.sport==='all'?'rev':'ok'}">${c.sport==='all'?'Все виды спорта':esc(c.sport)}</span></div><h3 style="font-size:1.2rem">${esc(c.t)}</h3><p>${esc(c.about)}</p>${author(c)}<p class="small muted">${mins(c)} мин${c.cert?' · <span style="color:var(--mint)">даёт сертификат</span>':''}</p>
   ${open?`<div class="prog"><i style="width:${dn/ls.length*100}%"></i></div><div class="foot"><span class="small muted">${dn} из ${ls.length} ур.</span><button class="btn sm" data-course="${c.id}">${dn?'Продолжить':'Открыть'}</button></div>`:`<div class="foot"><span class="small muted">${ls.length} ур.</span><span class="pill wait">Скоро</span></div>`}</div>`}).join('')||'<div class="card"><p class="muted">Для этого вида спорта курсов пока нет.</p></div>'}</div>`}

function vCourse(){
  const c=COURSES.find(x=>x.id===S.course);if(!c)return vCourses();const m=me(),sub=active(m)||(!!m.club&&!!c.cert);
  return `<button class="btn ghost sm" data-go="courses">← К курсам</button>${head('Курс',esc(c.t))}<p class="muted" style="margin:-10px 0 12px">${esc(c.about)}</p><div style="margin-bottom:18px">${author(c)}</div>
  <div class="card">${c.lessons.map((l,i)=>{const free=i===0,can=sub||free,did=m.d.includes(l.id);
   return `<div class="row"><span class="num">${did?ic('check'):i+1}</span><div class="t"><h3>${esc(l.t)}</h3><p class="small muted">${l.min} мин${free&&!sub?' · бесплатный урок':''}</p></div>
   <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:flex-end">${did?'<span class="pill ok">Пройден</span>':''}${can?`<button class="btn ${did?'ghost':''} sm" data-lesson="${l.id}">${did?'Повторить':'Открыть'}</button>`:'<span class="pill wait">По подписке</span>'}</div></div>`}).join('')}</div>
  ${sub?'':lockBox()}`}

function vLesson(){
  const l=lesson(S.lesson);if(!l)return vCourses();const c=COURSES.find(x=>x.id===l.c),i=c.lessons.findIndex(x=>x.id===l.id);
  if(!canLesson(me(),c,i))return `<button class="btn ghost sm" data-course="${c.id}">← К курсу</button>${lockBox()}`;
  const picked=S.quiz[l.id],did=me().d.includes(l.id);
  return `<button class="btn ghost sm" data-course="${c.id}">← ${esc(c.t)}</button>${head(`Урок ${i+1} · ${l.min} мин`,esc(l.t))}
  <div class="card"><div class="player" style="aspect-ratio:16/7;margin-top:0">${LINES}<span class="play">${ic('play')}</span><span class="pill tag">Видеоурок</span><div class="bar"><i></i></div></div>
  <p class="small muted">Место для видео. Файл хранится на сервере в Беларуси.</p>
  ${(l.body||[l.text]).map(t=>`<p class="lp">${esc(t)}</p>`).join('')}${l.points?`<div class="keys"><p class="eyebrow">Главное</p><ul>${l.points.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}${l.src?`<p class="small muted srcs">Источники: ${l.src.map(k=>`<a href="${SRC[k][1]}" target="_blank" rel="noopener">${esc(SRC[k][0])}</a>`).join('; ')}</p>`:''}</div>
  ${l.q?`<div class="card mt"><p class="eyebrow">Проверка</p><h3 style="margin-bottom:14px;font-size:1.15rem">${esc(l.q)}</h3>${l.o.map((o,j)=>`<button class="opt ${picked===j?(j===l.r?'right':'wrong'):''}" data-ans="${l.id}:${j}">${esc(o)}${picked===j?(j===l.r?' — верно':' — попробуйте ещё раз'):''}</button>`).join('')}${did?'<p class="pill ok" style="margin-top:8px">Урок пройден</p>':''}</div>`:''}
  ${l.home?`<div class="card mt home-talk"><span class="ic gold">${ic('users')}</span><div><p class="eyebrow">Обсудите дома</p><h3 style="margin-bottom:10px">Два вопроса ребёнку после урока</h3><ol>${l.home.map(q=>`<li>${esc(q)}</li>`).join('')}</ol><p class="small muted" style="margin-top:10px">Спрашивайте спокойно, без оценки. Ответы не нужно никуда записывать.</p></div></div>`:''}
  ${(()=>{const nx=c.lessons[i+1];return nx?`<div class="mt" style="display:flex;justify-content:flex-end"><button class="btn" data-lesson="${nx.id}">Следующий урок: ${esc(nx.t)} ${ic('arrow')}</button></div>`:''})()}`}

function vEvents(){
  const m=me(),sub=active(m),now=Date.now();
  const up=D.events.filter(e=>e.at>=now).sort((a,b)=>a.at-b.at),past=D.events.filter(e=>e.at<now).sort((a,b)=>b.at-a.at);
  const card=e=>{const reg=m.reg.includes(e.id);return `<div class="card ev">${evDate(e)}<div style="flex:1;min-width:0"><p class="eyebrow" style="margin-bottom:4px">${e.type} · ${hm(e.at)}</p><h3>${esc(e.t)}</h3><p class="small muted">${e.sport==='all'?'Для всех видов спорта':esc(e.sport)}</p>${reg&&sub&&e.link?`<p class="small gold" style="margin-top:8px">${esc(e.link)}</p>`:''}
   <div class="acts">${!sub?'<span class="pill wait">По подписке</span>':reg?`<span class="pill ok">Вы записаны</span> <button class="btn ghost sm" data-rem="${e.id}" aria-pressed="${m.rem.includes(e.id)}">${ic(m.rem.includes(e.id)?'check':'clock')}${m.rem.includes(e.id)?'Напомню за день':'Напомнить за день'}</button> <button class="btn ghost sm" data-unreg="${e.id}">Отменить</button>`:`<button class="btn sm" data-reg="${e.id}">Записаться</button>`}</div></div></div>`};
  return `${head('Расписание','Семинары и вебинары')}${sub?'':'<div class="card lock" style="margin-bottom:16px"><p>Расписание открыто всем, запись и записи вебинаров — по подписке.</p><button class="btn" data-go="plans">Выбрать подписку</button></div>'}
  <div class="grid g2">${up.map(card).join('')||'<div class="card"><p class="muted">Пока ничего не запланировано.</p></div>'}</div>
  <div class="card mt"><p class="eyebrow">Архив</p><h3 style="margin-bottom:6px">Записи вебинаров</h3>${past.map(e=>`<div class="row"><span class="ic">${ic('film')}</span><div class="t"><p><b>${esc(e.t)}</b></p><p class="small muted">${e.type} · ${fd(e.at)}</p></div>${e.rec?(sub?'<button class="btn sm" data-toast="Здесь откроется запись">Смотреть запись</button>':'<span class="pill wait">По подписке</span>'):'<span class="pill">Записи нет</span>'}</div>`).join('')||'<p class="muted small">Пока пусто.</p>'}</div>`}

function vProfile(){
  const m=me(),hist=m.d.map(lesson).filter(Boolean);
  return `${head('Мой кабинет','Профиль и подписка')}<div class="grid g2" style="align-items:start">
  <div class="card"><p class="eyebrow">Подписка</p><p style="margin-bottom:12px">${statusPill(m)}</p>
   ${active(m)?`<p class="small muted">Осталось ${Math.ceil((m.until-Date.now())/DAY)} дн.</p><button class="btn ghost sm" style="margin-top:12px" data-go="plans">Продлить</button>`:m.pend?'<p class="small muted">Организатор проверит оплату и откроет доступ.</p>':'<button class="btn" data-go="plans">Оформить подписку</button>'}
   <h3 style="margin-top:28px">История обучения</h3>
   ${hist.length?hist.map(l=>`<div class="row"><div class="t"><p>${esc(l.t)}</p><p class="small muted">${esc(COURSES.find(c=>c.id===l.c).t)}</p></div><span class="pill ok">Пройден</span></div>`).join(''):'<p class="muted small">Пока нет пройденных уроков.</p>'}
   <h3 style="margin-top:28px">Мои записи</h3>
   ${m.reg.length?m.reg.map(id=>D.events.find(e=>e.id===id)).filter(Boolean).map(e=>`<div class="row"><div class="t"><p>${esc(e.t)}</p><p class="small muted">${ft(e.at)}</p></div></div>`).join(''):'<p class="muted small">Вы ни на что не записаны.</p>'}</div>
  <div style="display:grid;gap:16px;align-content:start">${m.certAt?`<div class="card cert"><div class="cert-top"><span class="ic gold">${ic('shield')}</span><span class="pill ok">Действителен</span></div><p class="eyebrow" style="margin-top:14px">Сертификат родителя</p><h3 style="font-size:1.35rem">${esc(m.n)}</h3><p class="small muted">прошёл(а) курс «${esc(COURSES[0].t)}»</p><div class="cert-no"><span>${certNo(m)}</span><span>${fd(m.certAt)}</span></div><button class="btn ghost sm" data-toast="Номер ${certNo(m)} скопирован (демо)">Скопировать номер для клуба</button></div>`:`<div class="card"><p class="eyebrow">Сертификат родителя</p><h3>Пройдите курс «${esc(COURSES[0].t)}»</h3><p class="small muted" style="margin:6px 0 12px">После трёх уроков вы получите номер, который клуб может проверить.</p><button class="btn sm" data-course="1">К курсу</button></div>`}
  <div class="card"><form id="fam-form"><p class="eyebrow">Семейный доступ · ${m.fam.length+1} из 4</p><h3 style="margin-bottom:6px">Одна подписка на семью</h3><p class="small muted" style="margin-bottom:8px">Второй родитель, бабушка или дедушка смотрят курсы со своим входом.</p>
   <div class="row"><span class="av">${initials(m.n)}</span><div class="t"><p><b>${esc(m.n)}</b></p><p class="small muted">владелец подписки</p></div></div>${m.fam.map((f,i)=>`<div class="row"><span class="av">${initials(f)}</span><div class="t"><p><b>${esc(f)}</b></p><p class="small muted">член семьи</p></div><button class="btn ghost sm" type="button" data-famdel="${i}">Убрать</button></div>`).join('')}
   ${m.fam.length<3?`<div class="code-row" style="margin-top:12px"><div class="f" style="margin:0;flex:1;min-width:180px"><label for="fam-n">Имя</label><input type="text" id="fam-n" placeholder="Например: Мария Лис"></div><button class="btn sm" type="submit">Пригласить</button></div>`:'<p class="small muted" style="margin-top:10px">Добавлено максимум участников.</p>'}</form></div>
  <div class="card"><form id="prof-form"><p class="eyebrow">Профиль</p>
   <div class="f"><label for="pf-n">Имя</label><input type="text" id="pf-n" value="${esc(m.n)}" autocomplete="name"></div>
   <div class="f"><label for="pf-s">Вид спорта ребёнка</label><select id="pf-s">${SPORTS.map(s=>`<option ${s===m.sport?'selected':''}>${esc(s)}</option>`).join('')}</select></div>
   <div class="f"><label for="pf-c">Город</label><input type="text" id="pf-c" value="${esc(m.city)}"></div>
   <button class="btn" type="submit">Сохранить</button></form>
   <p class="small muted" style="margin-top:16px">Данных о детях платформа не хранит.</p>
   <button class="btn ghost sm" data-act="reset" style="margin-top:12px">Сбросить данные макета</button></div></div></div>`}

/* ---------- графики ---------- */
function areaChart(w,labels,vals){
  const h=290,pl=38,pr=16,pt=16,pb=30,iw=w-pl-pr,ih=h-pt-pb;
  const max=Math.ceil(Math.max(...vals)*1.2/4)*4||4;
  const x=i=>pl+iw*i/(vals.length-1),y=v=>pt+ih*(1-v/max);
  let d=`M${x(0)} ${y(vals[0])}`;
  for(let i=1;i<vals.length;i++){const mx=(x(i-1)+x(i))/2;d+=` C${mx} ${y(vals[i-1])} ${mx} ${y(vals[i])} ${x(i)} ${y(vals[i])}`}
  const grid=[0,1,2,3,4].map(k=>{const v=max*k/4,yy=y(v);return `<line x1="${pl}" x2="${w-pr}" y1="${yy}" y2="${yy}" stroke="#262a2b" stroke-width="1"/><text x="${pl-8}" y="${yy+4}" text-anchor="end">${Math.round(v)}</text>`}).join('');
  const xl=labels.map((l,i)=>`<text x="${x(i)}" y="${h-8}" text-anchor="${i===0?'start':i===labels.length-1?'end':'middle'}">${l}</text>`).join('');
  const lx=x(vals.length-1),ly=y(vals[vals.length-1]);
  return `<svg class="chart" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Подписчики по месяцам: ${labels.map((l,i)=>l+' '+vals[i]).join(', ')}"><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD21F" stop-opacity=".34"/><stop offset="1" stop-color="#FFD21F" stop-opacity="0"/></linearGradient></defs>${grid}
   <path d="${d} L${x(vals.length-1)} ${y(0)} L${x(0)} ${y(0)}Z" fill="url(#ag)"/><path class="ln" pathLength="1" d="${d}" fill="none" stroke="#FFD21F" stroke-width="2.4" stroke-linecap="round"/>
   <circle cx="${lx}" cy="${ly}" r="5" fill="#05080A" stroke="#FFD21F" stroke-width="2.4"/><text x="${lx}" y="${ly-14}" text-anchor="end" style="fill:#F3F0E8;font-weight:650">${vals[vals.length-1]}</text>${xl}</svg>`}
function donut(parts){
  const tot=parts.reduce((a,p)=>a+p.v,0)||1,r=62,c=2*Math.PI*r;let off=0;
  return `<svg width="168" height="168" viewBox="0 0 168 168" role="img" aria-label="Доли по видам спорта"><circle cx="84" cy="84" r="${r}" fill="none" stroke="#1e2220" stroke-width="20"/>${parts.map(p=>{const len=p.v/tot*c,s=`<circle cx="84" cy="84" r="${r}" fill="none" stroke="${p.c}" stroke-width="20" stroke-dasharray="${Math.max(0,len-3)} ${c}" stroke-dashoffset="${-off}" transform="rotate(-90 84 84)"/>`;off+=len;return s}).join('')}</svg>`}
function drawCharts(){document.querySelectorAll('[data-chart]').forEach(el=>{const w=Math.floor(el.clientWidth);if(w<200)return;const was=el.dataset.w;if(was==w)return;el.dataset.w=w;el.innerHTML=areaChart(w,JSON.parse(el.dataset.l),JSON.parse(el.dataset.v));requestAnimationFrame(()=>el.firstChild&&el.firstChild.classList.add('go'))})}

/* ---------- организатор ---------- */
function vDash(){
  const ps=D.parents,act=ps.filter(active).length,pend=ps.filter(p=>p.pend),soon=ps.filter(p=>active(p)&&p.until-Date.now()<7*DAY);
  const cnt={};ps.forEach(p=>cnt[p.sport]=(cnt[p.sport]||0)+1);
  const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]),cols=['#FFD21F','#3FD98A','#46C6D8','#E07A45'];
  const parts=top.slice(0,4).map(([s,v],i)=>({s,v,c:cols[i]}));const rest=top.slice(4).reduce((a,[,v])=>a+v,0);if(rest)parts.push({s:'Остальные виды',v:rest,c:'#4a5a54'});
  const first=ps.filter(p=>p.d.length).length,withEv=ps.filter(p=>p.reg.length).length;
  const fun=[['Зарегистрировались',ps.length],['Посмотрели урок',first],['Получили сертификат',ps.filter(p=>p.certAt).length],['Оформили подписку',act],['Записались на событие',withEv]];
  const labels=['Май','Июн','Июл','Авг','Сен','Окт'],vals=[2,3,5,6,8,act];
  return `${head('Back-office','Кабинет организатора','<button class="btn ghost sm" data-go="aevents">Расписание</button><button class="btn sm" data-go="users">Подписчики</button>')}
  <div class="grid g4" style="gap:14px">
  <div class="card kpi"><div class="row1"><span class="eyebrow">Родителей в системе</span>${ic('users')}</div><p class="v">${ps.length}</p><p class="d">из ${new Set(ps.map(p=>p.city)).size} городов</p></div>
  <div class="card kpi"><div class="row1"><span class="eyebrow">Активные подписки</span>${ic('shield')}</div><p class="v">${act}</p><p class="d">${soon.length} истекают за 7 дней</p></div>
  <div class="card kpi"><div class="row1"><span class="eyebrow">Выручка за 30 дней</span>${ic('wallet')}</div><p class="v">${money(D.rev)}<small>BYN</small></p><p class="d">по подтверждённым оплатам</p></div>
  <div class="card kpi ${pend.length?'warn':''}"><div class="row1"><span class="eyebrow">Ждут подтверждения</span>${ic('clock')}</div><p class="v">${pend.length}</p><p class="d">${pend.length?'откройте «Подписчики»':'всё обработано'}</p></div></div>
  <div class="grid g-main mt"><div class="card"><p class="eyebrow">Активные подписки по месяцам</p><h3 style="font-size:1.25rem;margin-bottom:8px">Динамика подписчиков</h3><div data-chart data-l='${JSON.stringify(labels)}' data-v='${JSON.stringify(vals)}' style="min-height:290px"></div></div>
  <div class="card"><p class="eyebrow">Состав</p><h3 style="font-size:1.25rem">Виды спорта</h3><div class="donut">${donut(parts)}<div class="c"><b>${ps.length}</b><span>родителей</span></div></div>
   <div class="leg">${parts.map(p=>`<div><i style="background:${p.c}"></i><span>${esc(p.s)}</span><b>${p.v}</b></div>`).join('')}</div></div></div>
  <div class="grid g-main mt"><div class="card"><p class="eyebrow">Воронка</p><h3 style="font-size:1.25rem">От регистрации до события</h3><div class="fun">${fun.map(([l,v],i)=>`<div><div class="l"><span>${l}</span><b>${v} <span class="muted" style="font-weight:500">· ${Math.round(v/ps.length*100)}%</span></b></div><div class="bar"><i style="width:${v/ps.length*100}%;background:${['#4a5a54','#46C6D8','#E07A45','#FFD21F','#3FD98A'][i]}"></i></div></div>`).join('')}</div></div>
  <div class="card"><p class="eyebrow">Требует внимания</p><h3 style="font-size:1.25rem;margin-bottom:4px">Оплаты и сроки</h3>
   ${pend.map(p=>`<div class="row"><div class="t"><p><b>${esc(p.n)}</b></p><p class="small muted">${PLANS.find(x=>x.id===p.pend).t}</p></div><button class="btn sm" data-confirm="${p.id}">Подтвердить</button></div>`).join('')}
   ${soon.map(p=>`<div class="row"><div class="t"><p><b>${esc(p.n)}</b></p><p class="small muted">истекает ${fd(p.until)}</p></div><span class="pill wait">Скоро</span></div>`).join('')}
   ${pend.length+soon.length?'':'<p class="muted small" style="margin-top:10px">Всё спокойно.</p>'}</div></div>`}
function vUsers(){
  const F={all:['Все',()=>true],act:['Активные',active],pend:['Ждут оплату',p=>p.pend],none:['Без подписки',p=>!active(p)&&!p.pend]};
  const list=D.parents.filter(F[S.uf][1]);
  return `${head('Back-office','Подписчики')}<div class="chips" role="group" aria-label="Фильтр">${Object.entries(F).map(([k,[t]])=>`<button class="chip" aria-pressed="${S.uf===k}" data-uf="${k}">${t} · ${D.parents.filter(F[k][1]).length}</button>`).join('')}</div>
  <div class="card mt"><div class="scroll"><table><thead><tr><th>Имя</th><th>Спорт</th><th>Город</th><th>Подписка</th><th></th></tr></thead><tbody>
  ${list.map(p=>`<tr><td><b>${esc(p.n)}</b></td><td>${esc(p.sport)}</td><td>${esc(p.city)}</td><td>${statusPill(p)}</td><td>${p.pend?`<button class="btn sm" data-confirm="${p.id}">Подтвердить оплату</button>`:''}</td></tr>`).join('')||'<tr><td colspan="5" class="muted">Никого нет.</td></tr>'}</tbody></table></div></div>`}
function vClubs(){
  const cs=D.clubs,codes=cs.reduce((a,c)=>a+c.codes,0),used=cs.reduce((a,c)=>a+c.used,0),certs=cs.reduce((a,c)=>a+c.certs,0);
  return `${head('Back-office','Клубы и коды')}<div class="grid g3" style="gap:14px">
  <div class="card kpi"><div class="row1"><span class="eyebrow">Клубов-партнёров</span>${ic('shield')}</div><p class="v">${cs.length}</p><p class="d">${[...new Set(cs.map(c=>c.city))].join(', ')}</p></div>
  <div class="card kpi"><div class="row1"><span class="eyebrow">Кодов активировано</span>${ic('card')}</div><p class="v">${used}<small>из ${codes}</small></p><p class="d">${Math.round(used/codes*100)}% семей начали</p></div>
  <div class="card kpi"><div class="row1"><span class="eyebrow">Сертификатов по клубам</span>${ic('check')}</div><p class="v">${certs}</p><p class="d">${Math.round(certs/used*100)}% от активировавших</p></div></div>
  <div class="grid g-main mt"><div class="card"><div class="scroll"><table><thead><tr><th>Клуб</th><th>Код</th><th>Активировано</th><th>Сертификаты</th></tr></thead><tbody>
  ${cs.map(c=>`<tr><td><b>${esc(c.n)}</b><p class="small muted">${esc(c.city)} · ${esc(c.sport)}</p></td><td><span class="pill wait">${esc(c.code)}</span></td><td style="min-width:150px"><p class="small"><b>${c.used}</b> из ${c.codes}</p><div class="prog" style="margin-top:6px"><i style="width:${c.used/c.codes*100}%"></i></div></td><td>${c.certs}</td></tr>`).join('')}</tbody></table></div></div>
  <div class="card"><form id="club-form"><p class="eyebrow">Новый пакет</p><h3 style="margin-bottom:12px">Выпустить коды для клуба</h3>
   <div class="f"><label for="cl-n">Клуб</label><input type="text" id="cl-n" placeholder="Например: ДЮСШ «Олимп»"></div>
   <div class="f"><label for="cl-c">Город</label><input type="text" id="cl-c" placeholder="Минск"></div>
   <div class="f"><label for="cl-k">Сколько семей</label><select id="cl-k"><option>20</option><option>40</option><option>60</option><option>100</option></select></div>
   <p class="small muted" style="margin-bottom:12px">Счёт клубу: 12 BYN за семью (пример).</p>
   <button class="btn" type="submit">Выпустить коды</button></form></div></div>`}
function vAEvents(){
  const ev=D.events.slice().sort((a,b)=>a.at-b.at);
  return `${head('Back-office','Расписание')}<div class="grid g-main"><div class="card"><p class="eyebrow">События</p>
  ${ev.map(e=>`<div class="row">${evDate(e)}<div class="t"><p><b>${esc(e.t)}</b></p><p class="small muted">${e.type} · ${hm(e.at)} · ${e.sport==='all'?'все виды':esc(e.sport)} · записалось ${D.parents.filter(p=>p.reg.includes(e.id)).length}</p></div><button class="btn ghost sm" data-del="${e.id}">Удалить</button></div>`).join('')}</div>
  <div class="card"><form id="ev-form"><p class="eyebrow">Новое событие</p>
   <div class="f"><label for="ev-t">Название</label><input type="text" id="ev-t" placeholder="Например: Как выбрать секцию"></div>
   <div class="f"><label for="ev-k">Тип</label><select id="ev-k"><option>Вебинар</option><option>Семинар</option></select></div>
   <div class="f"><label for="ev-s">Вид спорта</label><select id="ev-s"><option value="all">Для всех</option>${SPORTS.map(s=>`<option>${esc(s)}</option>`).join('')}</select></div>
   <div class="f"><label for="ev-d">Дата и время</label><input type="datetime-local" id="ev-d"></div>
   <button class="btn" type="submit">Добавить</button></form></div></div>`}
function vContent(){
  return `${head('Back-office','Материалы')}<p class="muted" style="margin:-10px 0 18px">Родители видят только утверждённые курсы. Статус меняет методист.</p>
  <div class="card"><div class="scroll"><table><thead><tr><th>Курс</th><th>Спорт</th><th>Уроков</th><th>Источники</th><th>Эксперт</th><th>Статус</th></tr></thead><tbody>
  ${COURSES.map(c=>`<tr><td><b>${esc(c.t)}</b></td><td>${c.sport==='all'?'все':esc(c.sport)}</td><td>${c.lessons.length}</td><td class="small muted" style="max-width:220px">${esc(c.basis)}</td><td><span class="pill wait">Ждёт проверки</span></td><td style="min-width:190px"><label class="sr" for="st${c.id}">Статус</label><select id="st${c.id}" data-st="${c.id}">${STATUS.map((s,i)=>`<option value="${i}" ${D.status[c.id]===i?'selected':''}>${s}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table></div></div>`}

const VIEWS={landing:vLanding,login:vLogin,plans:vPlans,pay:vPay,home:vHome,courses:vCourses,course:vCourse,lesson:vLesson,events:vEvents,profile:vProfile,dash:vDash,users:vUsers,clubs:vClubs,aevents:vAEvents,content:vContent};
function render(){
  const body=VIEWS[S.view]();
  if(S.role)$('#app').innerHTML=shell(body);
  else{const k=body.indexOf('<!--/story-->'),pre=k<0?'':body.slice(0,k),post=k<0?body:body.slice(k+13);$('#app').innerHTML=pubTop()+pre+`<main class="pub">${DEMO}${post}</main>`}
  drawCharts();hud();
  if(window.T3&&$('#stage'))T3.mount($('#stage'));
}
function hud(){const st=$('#story');if(!st)return;const r=st.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(st.offsetHeight-innerHeight))),n=Math.min(4,Math.round(p*4));
  const b=$('#hud-bar');if(b)b.style.transform=`scaleX(${p.toFixed(3)})`;const t=$('#hud-n');if(t)t.innerHTML=`<b>0${n+1}</b> / 05`;
  document.querySelectorAll('.step').forEach((e,i)=>e.classList.toggle('on',i===n))}
addEventListener('scroll',hud,{passive:true});
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(drawCharts,150)});

/* ---------- события ---------- */
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-go],[data-act],[data-lesson],[data-course],[data-ans],[data-sport],[data-plan],[data-pay],[data-reg],[data-unreg],[data-confirm],[data-del],[data-toast],[data-scroll],[data-uf],[data-rem],[data-famdel]');if(!t)return;
  const d=t.dataset;
  if(d.scroll){const el=$(d.scroll);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});return}
  if(d.go){go(d.go);return}
  if(d.uf){S.uf=d.uf;render();return}
  if(d.rem){const m=me(),id=+d.rem;m.rem=m.rem.includes(id)?m.rem.filter(x=>x!==id):[...m.rem,id];toast(m.rem.includes(id)?'Напомним за день: email и Telegram (демо)':'Напоминание выключено');render();return}
  if(d.famdel){me().fam.splice(+d.famdel,1);render();return}
  if(d.sport){const y=window.scrollY;S.sport=d.sport;render();window.scrollTo({top:y,behavior:'instant'});return}
  if(d.course){go('course',{course:+d.course});return}
  if(d.lesson){go('lesson',{lesson:+d.lesson});return}
  if(d.toast){toast(d.toast);return}
  if(d.ans){
    const [id,j]=d.ans.split(':').map(Number),l=lesson(id);S.quiz[id]=j;
    if(j===l.r&&!me().d.includes(id)){const m=me();m.d.push(id);if(!m.certAt&&certified(m)){m.certAt=Date.now();toast('Курс пройден — вы получили сертификат '+certNo(m))}else toast('Урок пройден')}
    const y=window.scrollY;render();window.scrollTo({top:y,behavior:'instant'});return}
  if(d.plan){S.plan=d.plan;if(!S.role)S.role='parent';go('pay');return}
  if(d.pay){me().pend=d.pay;toast('Оплата отправлена на проверку');go('profile');return}
  if(d.reg){me().reg.push(+d.reg);toast('Вы записаны');render();return}
  if(d.unreg){me().reg=me().reg.filter(x=>x!==+d.unreg);render();return}
  if(d.confirm){
    const p=D.parents.find(x=>x.id===d.confirm),pl=PLANS.find(x=>x.id===p.pend),days={m1:30,m3:91,y1:365}[p.pend]||30;
    D.rev+=pl?pl.price:0;p.until=Math.max(p.until||0,Date.now())+days*DAY;p.pend=null;toast('Подписка продлена');render();return}
  if(d.del){D.events=D.events.filter(x=>x.id!==+d.del);D.parents.forEach(p=>p.reg=p.reg.filter(x=>x!==+d.del));render();return}
  const a=d.act;
  if(a==='enter-parent'){S.role='parent';go('home')}
  if(a==='enter-new'){const m=me();m.until=null;m.pend=null;m.club=null;S.role='parent';go('home')}
  if(a==='enter-admin'){S.role='admin';go('dash')}
  if(a==='out'){S.role=null;go('landing')}
  if(a==='reset'){D=seed();S.quiz={};S.certQ='';toast('Данные сброшены');render()}
});
document.addEventListener('submit',e=>{
  e.preventDefault();
  if(e.target.id==='cert-form'){S.certQ=$('#cert-n').value;const y=window.scrollY;render();window.scrollTo({top:y,behavior:'instant'});return}
  if(e.target.id==='code-form'){const v=$('#club-code').value.trim().toUpperCase(),c=D.clubs.find(x=>x.code===v);if(!c){toast('Код не найден. Для проверки: LED-2026');return}const m=me();m.until=null;m.pend=null;m.club=c.id;c.used++;S.role='parent';toast('Код клуба «'+c.n+'» активирован');go('home');return}
  if(e.target.id==='fam-form'){const v=$('#fam-n').value.trim();if(!v){toast('Введите имя');return}me().fam.push(v);toast('Приглашение отправлено (демо)');render();return}
  if(e.target.id==='club-form'){const n=$('#cl-n').value.trim(),c=$('#cl-c').value.trim();if(!n||!c){toast('Укажите клуб и город');return}const k=+$('#cl-k').value,code=(n.replace(/[^А-ЯA-Zа-яa-zЁё]/g,'').slice(0,4).toUpperCase()||'CLUB')+'-'+(100+D.clubs.length);D.clubs.push({id:'c'+(D.clubs.length+1),n,city:c,sport:'разные',code,codes:k,used:0,certs:0});D.rev+=k*12;toast('Выпущено '+k+' кодов: '+code);render();return}
  if(e.target.id==='prof-form'){const m=me();m.n=$('#pf-n').value.trim()||m.n;m.sport=$('#pf-s').value;m.city=$('#pf-c').value.trim()||m.city;toast('Сохранено');render()}
  if(e.target.id==='ev-form'){
    const t=$('#ev-t').value.trim(),dv=$('#ev-d').value;if(!t||!dv){toast('Укажите название и дату');return}
    D.events.push({id:D.nextE++,type:$('#ev-k').value,t,sport:$('#ev-s').value,at:new Date(dv).getTime(),link:'ссылка появится перед началом',rec:false});
    toast('Событие добавлено');render()}
});
document.addEventListener('change',e=>{const s=e.target.closest('[data-st]');if(s){D.status[+s.dataset.st]=+s.value;toast('Статус обновлён')}});
render();
