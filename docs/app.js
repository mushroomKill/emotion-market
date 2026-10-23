'use strict';
const $ = s => document.querySelector(s);
const esc = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const colors=['#d8c2ab','#b9cad6','#dfa99a','#c6beda','#b4c0ce','#cbbfaa','#e7cf8e','#bdcdb0'];
const ink = (paths,cls='')=>`<svg class="icon ${cls}" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const icons={
 home:ink('<path d="M3 15 16 4l13 11M7 13v15h18V13M13 28V18h7v10M22 8V4h4v7"/>'),
 market:ink('<path d="M5 14v14h22V14M3 11 7 4h18l4 7v3q-3 4-6 0-3 4-7 0-3 4-6 0-3 4-7 0zM11 28v-8h10v8M12 4l-2 7m10-7 3 7"/>'),
 travel:ink('<rect x="5" y="10" width="23" height="18" rx="4"/><path d="M11 10V6q5-4 11 0v4M10 11v16m13-16v16M14 18h5"/>'),
 wardrobe:ink('<path d="m12 5-8 4 4 8 4-2v13h15V15l3 2 3-8-9-4q-6 9-12 0" transform="translate(-3 0)"/>'),
 album:ink('<path d="M4 5q7-2 12 2 7-4 12-2v23q-7-2-12 1-5-3-12-1zM16 7v22M8 11h4m-4 5h4m8-5h4m-4 5h4"/>'),
 coin:ink('<circle cx="16" cy="16" r="12" fill="#e8d296"/><circle cx="16" cy="16" r="8"/><path d="M16 11v10m-3-10h5m-5 10h5"/>'),
 sun:ink('<circle cx="16" cy="16" r="6" fill="#ead59b"/><path d="M16 2v3m0 22v3M2 16h3m22 0h3M6 6l3 3m14 14 3 3M6 26l3-3M23 9l3-3"/>'),
 cloud:ink('<path d="M8 24a7 7 0 0 1-1-14 9 9 0 0 1 17 0 7 7 0 0 1 0 14z" fill="#d8dedb"/>'),
 rain:ink('<path d="M7 20a6 6 0 0 1 0-12 8 8 0 0 1 16 1 6 6 0 0 1 0 11z" fill="#d5dedb"/><path d="m9 25-1 3m9-3-1 3m9-3-1 3"/>'),
 mail:ink('<rect x="3" y="7" width="26" height="20" rx="2" fill="#f7efd9"/><path d="m3 8 13 11L29 8M3 26l8-9m18 9-8-9"/>'),
 bag:ink('<path d="M8 11h17l3 17H4zM11 12V8a5 5 0 0 1 10 0v4"/>'),
 heart:ink('<path d="M16 27 5 17C-3 5 11 1 16 10 21 1 35 5 27 17z" fill="#e2b6a3"/>'),
 leaf:ink('<path d="M7 27C-1 7 14 4 28 4 29 21 19 28 7 27ZM7 27 22 10m-6 6 0-7m0 8 8 0" fill="#c0cbaa"/>'),
 arrow:ink('<path d="M6 16h20m-7-7 7 7-7 7"/>'),
 close:ink('<path d="m9 9 14 14M23 9 9 23"/>'),
 settings:ink('<circle cx="16" cy="16" r="10"/><path d="M16 10v8m0 4h.01"/>'),
 gift:ink('<path d="M5 16h22v13H5zM3 11h26v5H3zM16 11v18M16 10C3 11 7-3 16 10c13 1 9-13 0 0"/>'),
 lock:ink('<rect x="7" y="14" width="18" height="14" rx="3"/><path d="M11 14V8a5 5 0 0 1 10 0v6M16 20v3"/>')
};
function mood(e,size=''){
 const i=DATA.emotions.indexOf(e),eyes=i===5?'<path d="m9 13 4 1m6 0 4-1"/>':i===2?'<path d="m9 11 4 2m6 0 4-2M11 15h.1m10 0h.1"/>':'<path d="M11 13h.1m10 0h.1" stroke-width="2.8"/>';
 const mouth=i===6?'<path d="M11 18q5 7 10 0"/>':i===7?'<path d="M12 18q4 3 8 0"/>':i===5?'<ellipse cx="16" cy="20" rx="2" ry="3"/>':i===3?'<path d="m13 20 3-2 3 2"/>':i===2?'<path d="M12 20h8"/>':'<path d="M12 21q4-5 8 0"/>';
 return `<svg class="mood ${size}" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2C7 1 2 8 3 17 2 27 9 30 17 29 28 30 31 22 29 14 30 6 23 1 16 2Z" fill="${colors[i]}" stroke="#796855" stroke-width="1.2"/><g fill="none" stroke="#6a5546" stroke-width="1.5" stroke-linecap="round">${eyes}${mouth}${i===1?'<path d="M24 17q4 5 0 5-3 0 0-5" fill="#a8bac9"/>':''}</g></svg>`;
}
function accessory(name){
 const paths={
 '蝴蝶结发卡':'<path d="M30 19 16 10v15l14-5 14 5V10z" fill="#ca9386"/><circle cx="30" cy="18" r="3" fill="#b67d70"/>',
 '毛线帽':'<path d="M22 23Q20-2 49 0q27 0 29 23" fill="#a9b396"/><path d="M20 19h61v9H20z" fill="#c0c8ac"/><circle cx="50" cy="1" r="6" fill="#d2d7be"/>',
 '小草帽':'<ellipse cx="49" cy="20" rx="40" ry="6" fill="#d9bd7b"/><path d="M27 17 33 0h32l7 17z" fill="#e7d19b"/><path d="M28 12h42v6H28z" fill="#b38b69"/>',
 '铃铛项圈':'<path d="M28 62q20 9 44-1l-1 5q-22 10-42 0z" fill="#b08e6d"/><circle cx="50" cy="70" r="5" fill="#dcc180"/><path d="M47 71h6m-3 0v3"/>',
 '条纹围巾':'<path d="M26 60q24 10 48 0v10q-22 10-47 0zM55 70h10l-2 19-11-2z" fill="#b98879"/><path d="m28 65 43 0M56 76h8m-9 7h8" stroke="#eedbc4" stroke-width="3"/>',
 '小雨衣':'<path d="M25 63q23 11 50 0l7 27H20z" fill="#dbc97b"/><path d="M50 69v21m-3-12h6m-6 6h6"/>',
 '背带裤':'<path d="M28 75h45l5 17H23zM30 62l7 1v17h-7zm35 1 7-1v18h-7z" fill="#8fa7b0"/><path d="M42 78h15v10H42z" fill="#bacbd0"/>',
 '毛毯斗篷':'<path d="M27 59q20 13 47 0l14 29q-34 15-73 0z" fill="#a4af90"/><path d="M51 67 36 93m14-25 20 25" stroke="#d9d8bc"/><circle cx="51" cy="68" r="3" fill="#d3b783"/>',
 '浴巾头巾':'<path d="M24 20q-3-16 24-18 27 1 28 18z" fill="#f3efdc"/><path d="M27 9q18-5 32 0l-9 10m10-8 9 5"/>',
 '毛线护耳':'<path d="M14 28Q14-5 49-4q33 0 36 32" fill="none" stroke="#aa9a93" stroke-width="5"/><ellipse cx="16" cy="30" rx="8" ry="12" fill="#d9c8ba"/><ellipse cx="83" cy="30" rx="8" ry="12" fill="#d9c8ba"/>',
 '花冠':'<path d="M16 18q33-20 67 0" stroke="#8b9e77" stroke-width="4"/><g fill="#e4b4a2"><circle cx="23" cy="14" r="5"/><circle cx="42" cy="8" r="5"/><circle cx="63" cy="10" r="5"/><circle cx="78" cy="16" r="5"/></g>',
 '水手领巾':'<path d="M27 60 50 71l24-11-10 21-14-7-13 7z" fill="#8faab5"/><path d="m50 74-4 18 11-1-5-17" fill="#b3c9ce"/>',
 '绣花小背包':'<path d="M65 60q17-4 21 10v19H66z" fill="#ba9477"/><path d="M72 72h11v12H72zm-1-13-7 30"/><path d="m75 77 4-4 3 4-3 4z" fill="#d9c59b"/>',
 '守夜人提灯':'<path d="M76 75q0-14 11-14t11 14" fill="none"/><path d="M76 75h23v21H76z" fill="#d5bc78"/><path d="M83 79h9v13h-9z" fill="#f8e7a8"/><path d="M73 74h29m-29 22h29"/>'
 };
 return `<svg class="accessory" viewBox="0 0 100 100" fill="none" stroke="#80664e" stroke-width="1.2" stroke-linejoin="round" aria-hidden="true">${paths[name]||''}</svg>`;
}
function cat(worn=Game.state.worn,cls=''){return `<span class="cat-art ${cls}"><img src="assets/cat.png" alt="白底橘斑的小猫" draggable="false">${['身上','颈部','头部'].map(slot=>worn[slot]?accessory(worn[slot]):'').join('')}</span>`;}
function foodIcon(i){
 const paths=[
 '<path d="M4 27Q0 26 4 19L13 5q3-5 6 0l10 15q4 7-2 7Z" fill="#f9f5e8"/><path d="M11 18h11v10H11z" fill="#879078"/>',
 '<path d="m2 27 15-23 14 23z" fill="#d5b58c"/><path d="M6 23 17 7l10 16z" fill="#f3e6bc"/><path d="m8 21 16 0" stroke="#a3b085" stroke-width="3"/><path d="m10 17 11 0" stroke="#d19c86" stroke-width="2"/>',
 '<rect x="2" y="5" width="28" height="23" rx="4" fill="#ae7c5d"/><path d="M5 8h10v17H5z" fill="#f8edcf"/><path d="M18 8h9v8h-9z" fill="#c3c99b"/><path d="M18 19h9v6h-9z" fill="#d6a288"/><circle cx="10" cy="16" r="3" fill="#c98f7b"/>'
 ];return ink(paths[i],'food-icon');
}
let page='home',category=0,food=0,wardTab='shop',modalKind='',activeSale=null,speech='',speechUntil=0;
const app=$('#app'),modal=$('#modal');
const tabs=[['home','小屋'],['market','市场'],['travel','行囊'],['wardrobe','装扮'],['album','图鉴']];
const categories=['买家','买家回礼','情绪小百科','装饰','纪念品','明信片'];
let toastTimer;
function toast(msg){$('#toast').textContent=msg;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3200);}
function showDialog(html,kind='detail'){
 modalKind=kind;modal.innerHTML=`<button class="close-btn" data-action="close" aria-label="关闭">${icons.close}</button>${html}`;
 if(!modal.open)modal.showModal();
}
function closeDialog(){modal.close();modalKind='';activeSale=null;}
function say(text){speech=text;speechUntil=Date.now()+6000;render();}
function eta(due){return `${Math.max(0,Math.ceil((due-Date.now())/1000))} 秒`;}
function timer(due){return `<span data-due="${due}">${eta(due)}</span>`;}
function heading(title,sub){return `<div class="page-heading"><h2>${title}</h2><p>${sub}</p></div>`;}
function render(){
 const s=Game.state;
 const date=new Date(2026,9,22+s.day-1),dateLabel=`${date.getMonth()+1}月${date.getDate()}日`;
 const badge=s.unread.length+(s.returnReport?1:0);
 app.innerHTML=`<aside class="outside-note"><span>情绪市场</span><p>每一种心情<br>都有它的去处。</p><small>一只猫，一间小屋，<br>一些慢慢发生的事。</small></aside><div class="book"><header class="topbar"><button class="day" data-action="settings" aria-label="日期、天气和试玩设置">${icons[s.weather==='晴天'?'sun':s.weather==='雨天'?'rain':'cloud']}<span>${dateLabel}<small>第 ${s.day} 天 · ${s.weather}</small></span></button><button class="brand" data-page="home">情绪市场<span>小猫的慢日子</span></button><div class="wallet" aria-label="${s.coins} 金币">${icons.coin}<b>${s.coins}</b></div></header><main id="main">${guide()}${({home:home,market:market,travel:travel,wardrobe:wardrobe,album:album})[page]()}</main><nav class="bottom-nav" aria-label="游戏导航">${tabs.map(([id,label])=>`<button data-page="${id}" class="${page===id?'active':''}" aria-current="${page===id?'page':'false'}">${icons[id]}<span>${label}</span>${id==='travel'&&badge?`<i class="dot">${badge}</i>`:id==='market'&&s.slots.some(x=>x?.ready)?'<i class="dot small"></i>':''}</button>`).join('')}</nav><footer class="demo-bar"><button data-action="settings">${icons.settings}试玩模式 · 时间已加速</button><button data-action="nextday">进入下一天 ${icons.arrow}</button></footer></div>`;
}
const guideSteps=[
 ['收一颗情绪泡泡','点小猫身边的泡泡，把今天的心情收进口袋。','去收泡泡','home'],
 ['把心情摆上小摊','点口袋里的情绪卡上架，看看谁需要这份心情。','去摆摊','market'],
 ['听故事，领取收益','约 10 秒后客人到来。点亮起的柜台，读完故事和小百科，再领取金币。','去看柜台','market'],
 ['用免费饭团去旅行','首单送的饭团已经放进行囊。选饭团，再点“出发”，等它寄信回来。','去准备行囊','travel']
];
function guide(){
 const step=Game.onboarding();if(Game.state.guideDismissed||step===4)return '';
 const g=guideSteps[step];
 return `<section class="onboarding" aria-label="新手引导"><div class="guide-heading"><span>第一次来 · ${step+1}/4</span><button data-action="guide-skip">跳过引导</button></div><div class="guide-dots" aria-hidden="true">${guideSteps.map((_,i)=>`<i class="${i<=step?'done':''}"></i>`).join('')}</div><b>${g[0]}</b><p>${step===0&&Game.state.trip?'小猫已经先出门了。等它回来，再点身边的泡泡收取心情。':g[1]}</p><button class="guide-go" data-action="guide-go">${g[2]} ${icons.arrow}</button></section>`;
}
function guideOverview(){
 showDialog(`<p class="eyebrow">第一次来，也不用着急</p><h2>一份心情的旅程</h2><ol class="help-list">${guideSteps.map(g=>`<li><b>${g[0]}</b><br>${g[1]}</li>`).join('')}</ol><p class="small-copy">买家会告诉你，这份情绪在他的生活中有什么作用。收益可以用于旅行和装扮，带回的见闻会留在图鉴里。</p><button class="primary wide" data-action="guide-resume">${Game.onboarding()===4?'已经学会了，回小屋看看':'继续我当前的一步'}</button>`,'guide');
}
function guideGo(){
 closeDialog();const step=Game.onboarding();page=guideSteps[step]?.[3]||'home';if(step===3)food=0;render();
 const selector=['.bubble','.emotion-card','.counter-slot.ready, .counter-slot:not(.empty)','[data-action="depart"]'][step];
 const target=selector?$(selector):null;
 if(target){target.classList.add('guide-target');target.scrollIntoView({block:'center',behavior:'smooth'});target.focus({preventScroll:true});}
 else $('.onboarding')?.scrollIntoView({block:'start'});
}
function home(){
 const s=Game.state,phrase=Date.now()<speechUntil?speech:s.trip?'便当带好了！我会给你寄明信片的。':s.weather==='雨天'&&s.worn['身上']==='小雨衣'?'有雨衣就不怕下雨了。':s.weather==='雨天'?'听着雨声发呆，很舒服。':'阳光正好，陪我发一会儿呆吧。';
 return `<section class="room ${s.weather==='雨天'?'rainy':s.weather==='阴天'?'cloudy':''}" aria-label="${esc(s.name)}的小屋"><img class="room-bg" src="assets/room.png" alt="有木窗、茶桌和绿色坐垫的温暖小屋"><div class="room-label"><span>${esc(s.name)}的小屋</span><small>${s.trip?'出门旅行中':s.weather==='雨天'?'听雨的好日子':'今天也慢慢来'}</small></div>${s.weather==='雨天'?'<div class="window-rain" aria-hidden="true">'+Array.from({length:14},(_,i)=>`<i style="left:${i*7}%;animation-delay:-${i*.21}s"></i>`).join('')+'</div>':''}${s.weather==='阴天'?'<div class="window-cloud" aria-hidden="true"></div>':''}<button class="mailbox" data-action="mailbox" aria-label="信箱${s.unread.length?'，有新明信片':''}">${icons.mail}${s.unread.length?`<b>${s.unread.length}</b>`:''}</button>${s.rewards.length?`<div class="wall-rewards">${s.rewards.map(i=>`<span title="${categories[i]}已集齐">${[icons.heart,icons.gift,icons.album,icons.wardrobe,icons.leaf,icons.mail][i]}</span>`).join('')}</div>`:''}<div class="speech">${esc(phrase)}</div>${s.trip?`<button class="away-card" data-page="travel">${icons.travel}<span>小猫在路上<small>还有 ${timer(s.trip.end)} 回家</small></span></button>`:`<button class="cat-button" data-action="pet" aria-label="摸摸${esc(s.name)}">${cat()}</button><div class="bubbles">${s.bubbles.map((e,i)=>`<button class="bubble b${i}" data-action="collect" data-i="${i}" aria-label="收取${e}泡泡" style="--bubble:${colors[DATA.emotions.indexOf(e)]}">${mood(e)}<span>${e}</span><i>＋</i></button>`).join('')}</div>`}<div class="room-bottom"><span>${s.trip?'空坐垫也在等它':s.bubbles.length===3?'心情攒满了，点点泡泡吧':`下一颗泡泡 ${timer(s.lastBubble+8000)}`}</span><button data-action="bag">${icons.bag} 背包 ${s.bag.length}/20${s.parcel.length?` +${s.parcel.length}待收`:''}</button></div>${s.returnReport?`<button class="return-tag" data-action="return">${icons.gift} 我回来啦，看看带回的礼物</button>`:''}</section><div class="quiet-note">${icons.leaf}<span>每一种心情，都值得被看见。</span></div>`;
}
function market(){
 const s=Game.state;
 return `${heading('把心情，交给懂它的人','开心或难过，都有被温柔接住的地方。')}<div class="market-banner">${mood(s.demand)}<div>今日有人在寻找 <b>${s.demand}</b><small>售价 ×1.5 · 等待时间减半</small></div><span class="paper-stamp">今日<br>行情</span></div><section class="stall" aria-label="三个情绪柜台"><div class="awning"></div><div class="stall-sign">心 情 小 摊</div><div class="counter-slots">${s.slots.map((slot,i)=>slot?`<button class="counter-slot ${slot.ready?'ready':''}" data-action="${slot.ready?'sale':'waiting'}" data-i="${i}"><span class="jar">${mood(slot.emotion)}</span><b>${slot.emotion}</b><small>${slot.ready?'客人来啦！':timer(slot.due)}</small>${slot.ready?'<span class="sale-tag">听听故事</span>':`<span class="pending-price">${slot.price} 金币</span>`}</button>`:`<button class="counter-slot empty" data-action="choose-card" data-i="${i}"><span class="empty-jar">＋</span><b>摆一份心情</b><small>柜台 ${i+1}</small></button>`).join('')}</div><div class="counter-board"></div><p class="stall-message">${s.slots.some(x=>x?.ready)?'有人停下了脚步，想听听你的心情。':'风铃响起的时候，就有客人来啦。'}</p></section><section class="bag-section"><div class="section-row"><h3>我的情绪口袋</h3><span>${s.bag.length} / 20 张</span></div><p class="small-copy">点一张情绪卡，放到空着的柜台上。</p>${bagCards('list')}${s.parcel.length?`<p class="inline-note">还有 ${s.parcel.length} 张旅行情绪待收；腾出空间后会自动入袋。</p>`:''}</section><button class="story-preview-link" data-action="story-preview" data-i="1">${icons.album}<span>钟表匠的五次相遇<small>故事预览 · 不改变游戏进度</small></span>${icons.arrow}</button><p class="footnote">每种情绪的基础售价相同。难过，不需要比开心更值钱。</p>`;
}
function bagCards(action='list',slot=''){
 const s=Game.state;
 return s.bag.length?`<div class="emotion-grid">${DATA.emotions.filter(e=>s.bag.includes(e)).map(e=>`<button class="emotion-card" data-action="${action}" data-emotion="${e}" ${slot!==''?`data-i="${slot}"`:''}>${mood(e)}<b>${e}</b><span>× ${s.bag.filter(x=>x===e).length}</span>${e===s.demand?'<small>今日行情</small>':''}</button>`).join('')}</div>`:`<div class="empty-state">${icons.bag}<p>口袋还是空空的。</p><button class="text-button" data-page="home">回小屋收取情绪泡泡</button></div>`;
}
function landscape(p,cls=''){return `<div class="landscape ${cls}" style="background-position:${p%2*100}% ${Math.floor(p/2)*50}%" role="img" aria-label="${DATA.places[p].name}的手绘风景"></div>`;}
function travel(){
 const s=Game.state;
 if(s.trip){
   const t=s.trip,progress=Math.min(100,(Date.now()-t.start)/(t.end-t.start)*100);
   return `${heading('有一封信，正在路上','让小猫自己决定，今天的风吹向哪里。')}<div class="travel-scene">${landscape(t.mailed?t.place:3)}${cat(t.worn,'traveler')}<span class="travel-label">${t.mailed?DATA.places[t.place].name:'目的地是个小秘密'}</span></div><section class="journey-paper"><h3>${esc(s.name)}正在旅行</h3><p>${t.mailed?'它寄出了明信片，也开始想家了。':'路上的小事，回来慢慢讲给你听。'}</p><div class="progress"><i data-progress="trip" style="width:${progress}%"></i></div><div class="section-row"><span>${t.mailed?'明信片已寄到信箱':'行程过半时会寄来明信片'}</span><b>${timer(t.end)} 后回家</b></div><button class="primary" data-action="mailbox">${icons.mail} 打开信箱 ${s.unread.length?`(${s.unread.length})`:''}</button></section><p class="footnote">小猫出门时，市场的柜台照常营业。</p>`;
 }
 return `${heading('给远方，留一点期待','准备好便当，剩下的就交给小猫。')}${s.returnReport?`<button class="return-banner" data-action="return">${icons.gift}<span>我回来啦！给你带了点东西。</span>${icons.arrow}</button>`:''}<div class="packing-illustration">${cat()}<span class="lunch-wrap">${foodIcon(food)}</span><span class="packing-note">便当带好了吗？</span></div><div class="section-row inset"><h3>今天带哪份便当？</h3><span>目的地随机</span></div><div class="food-list">${['饭团','三明治','豪华便当'].map((name,i)=>`<button class="food ${food===i?'selected':''}" data-action="food" data-i="${i}" aria-pressed="${food===i}">${foodIcon(i)}<span><b>${name}</b><small>${[20,30,40][i]} 秒旅行 · ${[10,20,35][i]}% 稀有装饰</small></span><strong>${i===0&&s.freeRice?'免费 ×'+s.freeRice:[30,60,100][i]+' 金币'}</strong><i class="radio"></i></button>`).join('')}</div><div class="inset"><button class="primary wide" data-action="depart">${icons.travel} 便当装好，出发吧</button><p class="small-copy centered">连续 5 次未带回稀有装饰，第 6 次必得。</p></div><div class="destination-heading"><h3>也许会去的地方</h3><button class="text-button" data-action="mailbox">我的信箱 ${s.unread.length?`(${s.unread.length})`:''}</button></div><div class="destinations">${DATA.places.map((p,i)=>`<button data-action="place" data-i="${i}">${landscape(i)}<span>${p.name}</span></button>`).join('')}</div>`;
}
function decorBadge(d){const box=d.slot==='头部'?'0 -8 100 50':d.slot==='颈部'?'10 50 85 48':'8 52 95 50';return `<div class="decor-drawing">${accessory(d.name).replace('class="accessory"','class="decor-glyph"').replace('viewBox="0 0 100 100"',`viewBox="${box}"`)}</div>`;}
function wardrobe(){
 const s=Game.state,items=DATA.decorations.filter(d=>wardTab==='shop'?d.price:s.owned.includes(d.name));
 return `${heading('穿上，一点小欢喜','一件新装饰，就值得开心一会儿。')}<div class="fitting-room"><div class="fitting-arch"></div>${cat()}<p>${s.trip?'旅行中 · 回家后可以换装':Object.values(s.worn).join(' / ')||'软软的毛，也是很好看的衣服'}</p></div><div class="segmented"><button data-action="wardtab" data-tab="shop" class="${wardTab==='shop'?'selected':''}">小小商店</button><button data-action="wardtab" data-tab="owned" class="${wardTab==='owned'?'selected':''}">我的衣柜 · ${s.owned.length}</button></div><div class="decor-grid">${items.length?items.map(d=>`<button class="decor-item ${s.worn[d.slot]===d.name?'equipped':''}" data-action="decor" data-name="${d.name}">${decorBadge(d)}<b>${d.name}</b><small>${d.slot}</small><span>${s.worn[d.slot]===d.name?'正在穿戴':s.owned.includes(d.name)?'已经拥有':d.price+' 金币'}</span></button>`).join(''):`<div class="empty-state">${icons.wardrobe}<p>衣柜还空着，先去商店挑一件吧。</p></div>`}</div><p class="footnote">首次穿戴会带来一份开心；旅行中还能遇见 6 件特别的装饰。</p>`;
}
function entries(catIndex){
 const s=Game.state;
 if(catIndex===0)return DATA.buyers.map((b,i)=>({id:i,name:b.name,owned:!!s.friends[i],hint:`似乎喜欢【${b.emotion}】`,icon:mood(b.emotion),detail:b.detail}));
 if(catIndex===1)return DATA.buyers.map((b,i)=>({id:i,name:b.gift,owned:s.gifts.includes(b.gift),hint:`${b.name} · ${Math.min(5,s.friends[i]||0)}/5 次见面`,icon:icons.gift}));
 if(catIndex===2)return DATA.emotions.flatMap((e,i)=>DATA.facts[e].map((f,j)=>({id:`${i}-${j}`,name:`${e} · ${['认识它','听懂它','照顾它'][j]}`,owned:s.facts.includes(`${i}-${j}`),hint:`卖出【${e}】时也许能读到`,icon:mood(e),detail:f})));
 if(catIndex===3)return DATA.decorations.map((d,i)=>({id:i,name:d.name,owned:s.owned.includes(d.name),hint:d.price?'小小商店里有售':d.source.replace('旅行稀有：','据说在')+'能找到',icon:decorBadge(d)}));
 if(catIndex===4)return DATA.places.flatMap((p,i)=>p.souvenirs.map((n,j)=>({id:`${i}-${j}`,name:n,owned:s.souvenirs.includes(n),hint:`据说在${p.name}能找到`,icon:icons.leaf})));
 return DATA.places.flatMap((p,i)=>p.letters.map((text,j)=>({id:`${i}-${j}`,name:`${p.name} · ${j+1}`,owned:s.postcards.includes(`${i}-${j}`),hint:'小猫还没寄来这张明信片',icon:icons.mail,detail:text})));
}
function album(){
 const s=Game.state,counts=Game.counts(),total=counts.reduce((a,b)=>a+b,0),items=entries(category);
 return `${heading('把相遇，慢慢收藏','那些被接住的心情，都留在这里。')}<div class="album-summary"><div>${icons.album}<b>${total}<small> / 94</small></b></div><span>已收录的相遇<small>每一类集齐可得 100 金币和一幅小画</small></span></div><div class="album-tabs" role="tablist">${categories.map((c,i)=>`<button role="tab" aria-selected="${category===i}" data-action="category" data-i="${i}" class="${category===i?'selected':''}">${c}<small>${counts[i]}/${[16,16,24,14,12,12][i]}</small></button>`).join('')}</div>${s.rewards.includes(category)?'<p class="complete-banner">这一页收满啦，纪念画已经挂到小屋墙上。</p>':''}<div class="collection-grid">${items.map(item=>`<button class="collection-item ${item.owned?'':'locked'}" data-action="entry" data-id="${item.id}"><span class="collection-icon">${item.icon}</span><b>${item.owned?item.name:'未遇见'}</b><small>${item.owned?(category===0?`好感 ${Math.min(s.friends[item.id],5)}/5`:'已收录'):item.hint}</small></button>`).join('')}</div>${category===2?'<p class="footnote">小百科沿用策划原稿，正式上线前待专业审核。</p>':''}`;
}
function welcome(){
 showDialog(`<div class="welcome-cat">${cat({})}</div><p class="eyebrow">一间小屋，等你回来</p><h2>每一种心情<br>都有它的去处。</h2><p>收起小猫的心情，在市场听一段故事，<br>再用收益为它准备一次旅行。<br>先给这个小伙伴起个名字吧。</p><form id="name-form"><label for="cat-name">小猫的名字</label><input id="cat-name" name="name" maxlength="12" value="${esc(Game.state.name)}" autocomplete="off"><button class="primary wide" type="submit">一起开始生活 ${icons.arrow}</button></form><small class="muted">自动保存在这个浏览器里。</small>`,'welcome');
}
function sale(i,stage=0){
 if(stage===0)activeSale={...Game.saleInfo(i),index:i};
 if(!activeSale?.buyerData)return;
 const a=activeSale,b=a.buyerData,e=a.fact.split('-').map(Number);
 if(stage===0){
  const story=a.story;
  const body=story?storyBody(story,a.visit,a.reply,'sale-reply'): `<p class="story-main">${b.story.replace('你的',esc(Game.state.name)+'的')}</p><p class="story-detail">${b.detail}</p>`;
  showDialog(`<div class="buyer-entrance">${mood(a.emotion)}<span>${icons.bag}</span></div><p class="eyebrow">今天，有人接住了这份心情</p><h2>${b.name}</h2>${body}<div class="friend-line">${icons.heart} 第 ${a.visit} 次见面 · ${a.visit>=5?'谢谢你记得他的故事':'五次相遇后会留下回礼'}</div><button class="primary wide" data-action="sale-next">听听这份心情的小知识 ${icons.arrow}</button>`,'sale');
 }else{
  showDialog(`<div class="fact-icon">${mood(a.emotion)}</div><p class="eyebrow">情绪小百科 · ${['认识它','听懂它','照顾它'][e[1]]}</p><h2>关于「${a.emotion}」</h2><p class="fact-copy">${DATA.facts[a.emotion][e[1]]}</p><p class="small-copy">原型文案，待专业审核后用于正式版本。</p><button class="primary wide" data-action="settle">收进图鉴，获得 ${a.price} 金币</button>`,'sale');
 }
}
function storyBody(story,visit,reply,action){
 return `<p class="chapter-title">${visit<=5?`第 ${visit} 次相遇 · `:''}${story.title}</p><p class="story-recap">${story.recap}</p><p class="story-main">“${story.line}”</p><p class="story-detail">${story.after}</p>${visit===3?`<div class="reply-list"><p class="small-copy">没有标准答案，回应不影响金币和回礼。</p>${reply===undefined?Game.replies.map((r,i)=>`<button class="secondary" data-action="${action}" data-i="${i}">${r.label}</button>`).join(''):`<p class="reply-chosen">你：${Game.replies[reply].label}</p><p class="reply-answer">${Game.replies[reply].answer}</p>`}</div>`:''}`;
}
function storyPreview(visit=1,reply){
 const story=Game.clockStory(visit);if(!story||visit>5)return;
 showDialog(`<p class="eyebrow">故事预览 · 不发奖励，不改变存档</p><h2>夜班钟表匠</h2>${storyBody(story,visit,reply,'preview-reply')}<div class="preview-nav">${visit>1?`<button class="secondary" data-action="story-preview" data-i="${visit-1}">上次相遇</button>`:''}${visit<5?`<button class="primary" data-action="story-preview" data-i="${visit+1}">下次相遇 ${icons.arrow}</button>`:'<button class="primary" data-action="close">回到游戏</button>'}</div>${visit===5?'<p class="small-copy">正式游玩中，第五笔与他的交易结算后，领取「慢半拍的怀表」和 50 金币；只发一次。</p>':''}`,'story-preview');
}
function clockAlbum(){
 const count=Game.state.friends[0]||0;
 showDialog(`<p class="eyebrow">买家 · 相遇手记</p><h2>夜班钟表匠</h2><p>已经相遇 ${count} 次 · 回礼：慢半拍的怀表</p><div class="chapter-list">${[1,2,3,4,5].map(v=>`<button class="secondary" data-action="story-memory" data-i="${v}" ${v>count?'disabled':''}>${v<=count?`${v}. ${Game.clockStory(v).title}`:`${v}. 等下次相遇，再慢慢听`}</button>`).join('')}</div><p class="small-copy">故事在交易结算后收录，重读不会重复领取奖励。</p>`);
}
function storyMemory(visit){
 const story=Game.storyMemory(visit);if(!story)return;
 showDialog(`<p class="eyebrow">相遇手记 · 已收录</p><h2>夜班钟表匠</h2>${storyBody(story,visit,story.reply,'')}<button class="primary wide" data-action="clock-album">回到相遇手记</button>`);
}
function postcard(id){
 const [p,i]=id.split('-').map(Number),place=DATA.places[p];Game.seenMail(id);
 const outfit=Game.state.postcardLooks?.[id]||{};
 showDialog(`<div class="postcard-picture">${landscape(p)}${cat(outfit,'postcat')}<span class="postmark">${place.name}<br>猫猫邮局</span></div><div class="letter"><p class="eyebrow">寄给家里的你</p><h2>来自${place.name}</h2><p>${place.letters[i]}</p><div class="signature">想你的，${esc(Game.state.name)}</div></div><button class="primary wide" data-action="close">好好收进图鉴</button>`,'postcard');render();
}
function mailbox(){
 const s=Game.state;
 if(s.unread.length){postcard(s.unread[0]);return;}
 showDialog(`${icons.mail}<h2>小小信箱</h2>${s.postcards.length?`<div class="mail-list">${s.postcards.slice().reverse().map(id=>{const [p,j]=id.split('-').map(Number);return `<button data-action="postcard" data-id="${id}">${icons.mail}<span>来自${DATA.places[p].name} · ${j+1}</span>${icons.arrow}</button>`;}).join('')}</div>`:'<p>还没有收到信。准备一份便当，<br>小猫会把路上的风景寄给你。</p><button class="primary wide" data-page="travel">去准备行囊</button>'}`,'mailbox');
}
function returnDialog(){
 const r=Game.state.returnReport;if(!r)return;
 showDialog(`<div class="welcome-cat small">${cat()}</div><p class="eyebrow">这一路的小惊喜</p><h2>我回来啦！</h2><p>从${r.place}带回了这些：</p><div class="return-loot"><div>${icons.leaf}<span>${r.souvenir}${r.repeat?'（重复，折成 20 金币）':''}</span></div><div>${mood(r.cards[0])}${mood(r.cards[1])}<span>${r.cards.join('、')} 各一张</span></div>${r.rare?`<div>${icons.gift}<span>稀有装饰：${r.rare}</span></div>`:''}</div>${Game.state.parcel.length?`<p class="small-copy">背包满了，还有 ${Game.state.parcel.length} 张情绪暂存着，腾出空间后自动收好。</p>`:''}<button class="primary wide" data-action="return-done">欢迎回家</button>`,'return');
}
function settings(){
 showDialog(`<p class="eyebrow">小屋备忘录</p><h2>慢慢玩的小说明</h2><ul class="help-list"><li>每 8 秒冒一个情绪泡泡，最多攒 3 个。</li><li>情绪背包最多 20 张，柜台有 3 格。</li><li>首单等待 10 秒，后续成交约 4–8 秒。</li><li>旅行 20–40 秒，过半收到明信片。</li><li>离开页面也会计时；小猫旅行中不产泡泡。</li><li>“进入下一天”只切换日期、天气与行情。</li></ul><p class="small-copy">存档保存在当前浏览器，不跨设备同步。小百科沿用策划原稿，待专业审核。</p>${!Game.storageOK?'<p class="inline-note">浏览器阻止了存档，当前进度仅在本次打开期间保留。</p>':''}<div class="settings-actions"><button class="secondary" data-action="guide-overview">重新查看新手引导</button><button class="secondary" data-action="story-preview" data-i="1">钟表匠故事预览</button><button class="secondary" data-action="rename">给小猫改名</button><button class="secondary" data-action="nextday">进入下一天</button><button class="text-button" data-action="reset-ask">重新开始</button></div>`,'settings');
}
function detailEntry(id){
 const item=entries(category).find(x=>String(x.id)===id);if(!item)return;
 if(!item.owned){toast(item.hint);return;}
 if(category===0&&id==='0'){clockAlbum();return;}
 if(category===5){postcard(id);return;}
 if(category===3){decorDetail(item.name);return;}
 const b=category<2?DATA.buyers[Number(id)]:null;
 showDialog(`<div class="detail-icon">${item.icon}</div><p class="eyebrow">${categories[category]} · 已收录</p><h2>${item.name}</h2><p class="fact-copy">${item.detail|| (category===1?`这是${b.name}留下的回礼。谢谢你，接住了这一路的小心情。`:item.hint.replace('据说在','从').replace('能找到','带回的小小纪念。'))}</p>${category===0?`<p class="friend-line">${icons.heart} 见过 ${Game.state.friends[id]} 次 · 回礼：${b.gift}</p>`:''}${category===2?'<p class="small-copy">原型文案，待专业审核。</p>':''}<button class="primary wide" data-action="close">好好收着</button>`);
}
function decorDetail(name){
 const d=DATA.decorations.find(v=>v.name===name),s=Game.state,owned=s.owned.includes(name),wearing=s.worn[d.slot]===name;
 showDialog(`<div class="decor-preview">${cat({...s.worn,[d.slot]:name})}</div><h2>${d.name}</h2><p>${d.slot}装饰 · ${d.price?'小小商店':d.source}</p><p class="small-copy">第一次穿上，小猫会冒出开心泡泡。</p><button class="primary wide" data-action="${owned?'wear':'buy'}" data-name="${d.name}" ${!owned&&!d.price?'disabled':''}>${owned?(wearing?'先收回衣柜':s.trip?'旅行中，回家后再穿':'给小猫穿上'):d.price?`${d.price} 金币 · 买下来`:'要在旅行里遇见'}</button>`,'decor');
}
document.addEventListener('click',event=>{
 const el=event.target.closest('button');if(!el)return;
 if(el.dataset.page){page=el.dataset.page;closeDialog();render();$('.book').scrollIntoView({behavior:'instant',block:'start'});return;}
 const a=el.dataset.action,i=Number(el.dataset.i),name=el.dataset.name;
 if(!a)return;
 if(a==='close'){closeDialog();return;}
 if(a==='guide-skip'){Game.dismissGuide();render();toast('随时可在“试玩模式”里重新查看引导。');return;}
 if(a==='guide-overview'){guideOverview();return;}
 if(a==='guide-resume'){Game.dismissGuide(false);guideGo();return;}
 if(a==='guide-go'){guideGo();return;}
 if(a==='story-preview'){storyPreview(i);return;}
 if(a==='preview-reply'){storyPreview(3,i);return;}
 if(a==='story-memory'){storyMemory(i);return;}
 if(a==='clock-album'){clockAlbum();return;}
 if(a==='sale-reply'){if(!activeSale)return;const r=Game.chooseReply(activeSale.index,i);if(r.error)toast(r.error);else sale(activeSale.index);return;}

 if(a==='collect'){const r=Game.collect(i);if(r.error)toast(r.error);else{say(r.quote);toast(`${r.emotion}，已经好好放进口袋。`);}return;}
 if(a==='pet'){const r=Game.pet();if(r.error)toast(r.error);else{say(r.quote);$('.cat-button')?.classList.add('petted');}return;}
 if(a==='bag'){showDialog(`<h2>我的情绪口袋</h2><p>把心情带去市场，遇见需要它的人。</p>${bagCards('bag-list')}<p class="small-copy">已装 ${Game.state.bag.length}/20 张${Game.state.parcel.length?'，另有 '+Game.state.parcel.length+' 张暂存情绪':''}</p><button class="primary wide" data-page="market">去情绪市场</button>`,'bag');return;}
 if(a==='choose-card'){showDialog(`<h2>给柜台 ${i+1} 摆一份心情</h2><p>每一种情绪，都有人愿意接住。</p>${bagCards('list',i)}`,'choose');return;}
 if(a==='list'||a==='bag-list'){const r=Game.list(el.dataset.emotion,el.dataset.i===undefined?undefined:i);if(r.error)toast(r.error);else{closeDialog();page='market';render();toast('心情摆好了，等一位有缘的客人。');}return;}
 if(a==='sale'){sale(i);return;}
 if(a==='sale-next'){if(activeSale)sale(activeSale.index,1);return;}
 if(a==='settle'){if(!activeSale)return;const r=Game.settle(activeSale.index,activeSale.fact);closeDialog();render();toast(r.error||`收到 ${r.coins} 金币${r.gift?'，还有回礼「'+r.gift+'」和 50 金币':r.first?'，另赠一份旅行饭团！':'，新的知识已经收进图鉴。'}`);return;}
 if(a==='waiting'){toast('客人还在路上，可以先照看小猫。');return;}
 if(a==='food'){food=i;render();return;}
 if(a==='depart'){const guided=!Game.state.guideDismissed&&Game.onboarding()===3;const r=Game.depart(food);if(r.error)toast(r.error);else{render();if(guided)showDialog(`<p class="eyebrow">四步小旅程 · 已完成</p><h2>现在，留一点期待</h2><p>行程过半，小猫会寄来明信片；回来时会带上纪念品和新的情绪。</p><p>你可以继续摆摊，认识常来的客人；每位买家第五次相遇会留下回礼。想重读故事，就去图鉴看看。</p><button class="primary wide" data-action="close">等一封远方的信</button>`,'guide-complete');else toast('便当带好了！我会给你寄明信片的。');}return;}
 if(a==='place'){const p=DATA.places[i];showDialog(`${landscape(i,'place-preview')}<h2>${p.name}</h2><p>可以带回：${p.souvenirs.join('、')}。</p><p>也许会遇见：${p.rare}。</p><p class="small-copy">目的地由小猫随机选择，尚有未收集物品的地方更容易去到。</p><button class="primary wide" data-action="close">留一点期待</button>`);return;}
 if(a==='wardtab'){wardTab=el.dataset.tab;render();return;}
 if(a==='decor'){decorDetail(name);return;}
 if(a==='buy'||a==='wear'){const r=a==='buy'?Game.buy(name):Game.wear(name);if(r.error)toast(r.error);else{closeDialog();render();toast(r.removed?'已经收回衣柜。':r.stored?'装饰买好啦，等小猫回家试试。':'真好看！小猫很喜欢。');}return;}
 if(a==='category'){category=i;render();return;}
 if(a==='entry'){detailEntry(el.dataset.id);return;}
 if(a==='postcard'){postcard(el.dataset.id);return;}
 if(a==='mailbox'){mailbox();return;}
 if(a==='return'){returnDialog();return;}
 if(a==='return-done'){Game.state.returnReport=null;Game.save();closeDialog();render();return;}
 if(a==='settings'){settings();return;}
 if(a==='nextday'){Game.nextDay();if(modalKind==='settings')closeDialog();render();toast(`新的一天，${Game.state.weather}，市场正在寻找${Game.state.demand}。`);return;}
 if(a==='rename'){showDialog(`<h2>给小猫换个名字</h2><form id="name-form"><label for="cat-name">小猫的名字</label><input id="cat-name" name="name" maxlength="12" value="${esc(Game.state.name)}"><button class="primary wide" type="submit">就叫这个名字</button></form>`,'rename');return;}
 if(a==='reset-ask'){showDialog('<h2>重新开始这段生活？</h2><p>会清空本浏览器中的金币、图鉴和旅行进度。</p><button class="secondary wide" data-action="close">保留现在的生活</button><button class="danger wide" data-action="reset">清空存档，重新开始</button>','reset');return;}
 if(a==='reset'){Game.reset();page='home';render();welcome();}
});
document.addEventListener('submit',event=>{if(event.target.id!=='name-form')return;event.preventDefault();Game.rename(new FormData(event.target).get('name'));closeDialog();render();toast(`${Game.state.name}：很高兴认识你。`);});
modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
modal.addEventListener('cancel',()=>{modalKind='';activeSale=null;});
document.addEventListener('visibilitychange',()=>{if(document.hidden)Game.visit();else{Game.tick();render();}});
window.addEventListener('pagehide',()=>Game.visit());
Game.tick();render();
if(!Game.state.named)welcome();
let lastVisit=Date.now();
setInterval(()=>{
 const events=Game.tick();
 if(events.length){render();if(events.includes('mail'))toast('叮咚，小猫寄来了一张明信片。');if(events.includes('home'))toast('我回来啦！给你带了点东西。');}
 document.querySelectorAll('[data-due]').forEach(el=>el.textContent=eta(Number(el.dataset.due)));
 const t=Game.state.trip,p=$('[data-progress="trip"]');if(p&&t)p.style.width=Math.min(100,(Date.now()-t.start)/(t.end-t.start)*100)+'%';
 if(speech&&Date.now()>speechUntil){speech='';if(page==='home')render();}
 if(Date.now()-lastVisit>10000){Game.visit();lastVisit=Date.now();}
},500);
