// 金币经济与收集节奏模拟（30 天）
// 复现：node analysis/economy-simulation.cjs
// 规则取自 dist/game.js 与 dist/data.js，时间按正式版的真实时长计算（试玩版做了加速）。
// 全部为模拟结果，不是真实玩家数据。
const fs=require('node:fs'),path=require('node:path');
const DAYS=30,N=Number(process.env.N||4000),SEED=20261023,H=60;
function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
const PLACE_EMO=[[7,6],[7,5],[4,7],[6,7],[6,3],[4,3]]; // 海边、竹林、雪山、花田、古城、灯塔
const TOTAL=[16,16,24,14,12,12]; // 买家、回礼、百科、装饰、纪念品、明信片 = 94
const SCHEDULES={轻度:[8.5,21.5],常规:[8.5,12.5,21.5],高频:[8.5,11,14,18,22]};
const BASE={interval:60,cap:3,bag:20,slots:3,price:[20,30],demandMul:1.5,food:[30,60,100],trip:[[2,4],[4,8],[8,12]],
  rare:[.1,.2,.35],pityAt:5,places:PLACE_EMO,tripCards:'happyTired',policy:'trip',
  mods:{晴天:{6:2},阴天:{3:1.5,5:1.5},雨天:{1:2,7:1.5},returned:{6:2,5:2},decor:{6:2},lonely:{4:3}},shop:[120,150,150,120,150,250,300,400],giftAt:5,giftBonus:50,setBonus:100,startCoins:80};

function simulate(cfg,schedule,seed){
  const R=rng(seed),pick=a=>a[Math.floor(R()*a.length)];
  const wpick=(items,w)=>{let n=R()*w.reduce((a,b)=>a+b,0);for(let i=0;i<items.length;i++){n-=w[i];if(n<0)return items[i];}return items.at(-1);};
  const S={coins:cfg.startCoins,bubbles:[6,0],bag:[],parcel:[],slots:[],lastBubble:0,lastSeen:0,trip:null,returnedUntil:-1,newDecorUntil:-1,lonely:false,
    friends:new Array(16).fill(0),gifts:0,facts:new Set(),shop:new Set(),rare:new Set(),souvenirs:new Set(),postcards:new Set(),pity:0,sales:0,freeRice:0,rewards:new Set(),weather:'晴天',demand:7};
  const M={earn:{sale:0,gift:0,set:0,repeat:0},spend:{trip:0,decor:0},bubbles:0,lost:0,emo:new Array(8).fill(0),tripCards:0,decorCards:0,sold:0,trips:0,food:[0,0,0],bagBlocked:0,capped:0,home:0,
    day:{firstDecor:null,shopDone:null,firstRare:null,rareDone:null,firstGift:null,clockGift:null,buyersDone:null,giftsDone:null,factsDone:null},
    coinsEnd:new Array(DAYS).fill(0),collected:new Array(DAYS).fill(0),earned:new Array(DAYS).fill(0),sales:new Array(DAYS).fill(0),shopOwned:new Array(DAYS).fill(0),rareOwned:new Array(DAYS).fill(0),giftsOwned:new Array(DAYS).fill(0)};
  const dayOf=t=>Math.min(DAYS,Math.floor(t/(24*H))+1);
  const mark=(k,t)=>{if(M.day[k]===null)M.day[k]=dayOf(t);};
  const counts=()=>[S.friends.filter(v=>v>0).length,S.gifts,S.facts.size,S.shop.size+S.rare.size,S.souvenirs.size,S.postcards.size];
  const earn=(k,v,t)=>{S.coins+=v;M.earn[k]+=v;M.earned[dayOf(t)-1]+=v;};
  const checkRewards=t=>counts().forEach((v,i)=>{if(v===TOTAL[i]&&!S.rewards.has(i)){S.rewards.add(i);earn('set',cfg.setBonus,t);}});
  const emotion=at=>{const md=cfg.mods,w=[0,1,2,3,4,5,6,7].map(i=>{let x=1;const ap=o=>{if(o&&o[i])x*=o[i];};
      ap(md[S.weather]);if(at<S.returnedUntil)ap(md.returned);if(at<S.newDecorUntil)ap(md.decor);if(S.lonely)ap(md.lonely);return x;});
    const e=wpick([0,1,2,3,4,5,6,7],w);S.lonely=false;return e;};
  const flush=()=>{while(S.parcel.length&&S.bag.length<cfg.bag)S.bag.push(S.parcel.shift());};
  const accrue=t=>{if(S.trip||t<=S.lastBubble)return;M.home+=t-S.lastBubble;
    if(S.bubbles.length>=cfg.cap){M.capped+=t-S.lastBubble;S.lastBubble=t;return;}
    const n=Math.floor((t-S.lastBubble)/cfg.interval),space=cfg.cap-S.bubbles.length,k=Math.min(n,space);
    for(let i=0;i<k;i++){S.bubbles.push(emotion(S.lastBubble+(i+1)*cfg.interval));M.bubbles++;}
    if(n>=space){const fullAt=S.lastBubble+space*cfg.interval;M.capped+=t-fullAt;M.lost+=Math.floor((t-fullAt)/cfg.interval);S.lastBubble=t;}
    else S.lastBubble+=n*cfg.interval;};
  const tripReturn=()=>{const {place:p,food,end}=S.trip;
    const unseen=[p*2,p*2+1].filter(i=>!S.postcards.has(i));S.postcards.add(unseen.length?pick(unseen):p*2);
    const sv=wpick([p*2,p*2+1],[p*2,p*2+1].map(s=>S.souvenirs.has(s)?1:3));if(S.souvenirs.has(sv))earn('repeat',20,end);else S.souvenirs.add(sv);
    S.parcel.push(...(cfg.tripCards==='pair'?[cfg.places[p][0],cfg.places[p][1]]:[pick(cfg.places[p]),pick([6,5])]));M.tripCards+=2;flush();
    if(S.pity>=cfg.pityAt||R()<cfg.rare[food]){const miss=[0,1,2,3,4,5].filter(i=>!S.rare.has(i));const r=!S.rare.has(p)?p:miss.length?pick(miss):null;
      if(r!==null){S.rare.add(r);mark('firstRare',end);if(S.rare.size===6)mark('rareDone',end);}S.pity=0;}else S.pity++;
    S.trip=null;S.returnedUntil=end+6*H;S.lastBubble=end;checkRewards(end);};
  const settle=t=>{S.slots=S.slots.filter(s=>{if(s.due>t)return true;
    const j=[0,1,2].find(j=>!S.facts.has(s.e*3+j));if(j!==undefined)S.facts.add(s.e*3+j);earn('sale',s.price,t);
    S.friends[s.buyer]++;if(S.friends[s.buyer]===cfg.giftAt){S.gifts++;earn('gift',cfg.giftBonus,t);mark('firstGift',t);if(s.buyer===0)mark('clockGift',t);if(S.gifts===16)mark('giftsDone',t);}
    if(S.friends.every(v=>v>0))mark('buyersDone',t);if(S.facts.size===24)mark('factsDone',t);
    S.sales++;M.sold++;M.sales[dayOf(t)-1]++;if(S.sales===1)S.freeRice++;checkRewards(t);return false;});};
  const list=t=>{while(S.slots.length<cfg.slots&&S.bag.length){let i=S.bag.indexOf(S.demand);if(i<0)i=0;const e=S.bag.splice(i,1)[0];flush();
      const hot=e===S.demand,first=S.sales===0&&S.slots.length===0,b=[e*2,e*2+1],buyer=wpick(b,b.map(x=>S.friends[x]?1:2));
      M.emo[e]++;S.slots.push({e,buyer,due:first?t:t+(30+R()*60)/(hot?2:1),price:Math.round((cfg.price[0]+Math.floor(R()*(cfg.price[1]-cfg.price[0]+1)))*(hot?cfg.demandMul:1))});}};
  const wearNew=t=>{S.newDecorUntil=t+2*H;M.decorCards++;if(!S.trip&&S.bubbles.length<cfg.cap)S.bubbles.push(6);else if(S.bag.length<cfg.bag)S.bag.push(6);else S.parcel.push(6);};
  const shopping=t=>{for(;;){const left=cfg.shop.map((p,i)=>i).filter(i=>!S.shop.has(i)).sort((a,b)=>cfg.shop[a]-cfg.shop[b]);
      if(!left.length||S.coins<cfg.shop[left[0]])break;const i=left[0];S.coins-=cfg.shop[i];M.spend.decor+=cfg.shop[i];S.shop.add(i);
      if(!S.trip)wearNew(t);else S.pendingWear=true;mark('firstDecor',t);if(S.shop.size===8)mark('shopDone',t);checkRewards(t);}};
  const depart=(t,night)=>{if(S.trip)return;let food;
    if(S.freeRice>0){food=0;S.freeRice--;}
    else{food=(night&&cfg.nightLux&&S.coins>=cfg.food[2])?2:S.coins>=cfg.food[1]?1:S.coins>=cfg.food[0]?0:null;if(food===null)return;S.coins-=cfg.food[food];M.spend.trip+=cfg.food[food];}
    const place=wpick([0,1,2,3,4,5],[0,1,2,3,4,5].map(p=>!S.rare.has(p)||!S.souvenirs.has(p*2)||!S.souvenirs.has(p*2+1)||!S.postcards.has(p*2)||!S.postcards.has(p*2+1)?2:1));
    const [a,b]=cfg.trip[food];S.trip={place,food,end:t+(a+R()*(b-a))*H};M.trips++;M.food[food]++;};
  const times=[];for(let d=0;d<DAYS;d++)schedule.forEach((h,k)=>{const j=(d===0&&k===0)?0:(R()-.5)*60;times.push({t:d*24*H+h*H+j,night:k===schedule.length-1});});
  S.lastBubble=times[0].t;S.lastSeen=times[0].t;
  let curDay=1;
  const snap=d=>{M.coinsEnd[d-1]=S.coins;M.collected[d-1]=counts().reduce((a,b)=>a+b,0);M.shopOwned[d-1]=S.shop.size;M.rareOwned[d-1]=S.rare.size;M.giftsOwned[d-1]=S.gifts;};
  for(const {t,night} of times){const d=dayOf(t);
    while(curDay<d){snap(curDay);curDay++;S.weather=wpick(['晴天','阴天','雨天'],[2,1,1]);S.demand=pick([0,1,2,3,4,5,6,7].filter(e=>e!==S.demand));}
    if(t-S.lastSeen>12*H)S.lonely=true;
    if(S.trip&&S.trip.end<=t)tripReturn();
    accrue(t);settle(t);
    if(S.pendingWear&&!S.trip){S.pendingWear=false;wearNew(t);}
    while(S.bubbles.length){if(S.bag.length>=cfg.bag){M.bagBlocked++;break;}S.bag.push(S.bubbles.shift());}
    list(t);settle(t);list(t);if(cfg.policy==='decor'){shopping(t);depart(t,night);}else{depart(t,night);shopping(t);}S.lastSeen=t;}
  while(curDay<=DAYS){snap(curDay);curDay++;}
  return M;
}
const q=(a,p)=>{const s=a.filter(v=>v!==null).sort((x,y)=>x-y);if(s.length<a.length*p)return null;return s[Math.ceil(p*a.length)-1]??null;};
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
function summarize(cfg,label,seedBase){const out={};
  Object.entries(SCHEDULES).forEach(([name,sch],si)=>{const runs=[];for(let r=0;r<N;r++)runs.push(simulate(cfg,sch,seedBase+si*1e6+r));
    const days=k=>{const v=runs.map(m=>m.day[k]);const reached=v.filter(x=>x!==null).length/N;return {p50:q(v,.5),p90:q(v,.9),reached30:+reached.toFixed(3)};};
    const per=(f,from,to)=>+mean(runs.map(m=>mean(f(m).slice(from,to)))).toFixed(1);
    out[name]={
      opensPerDay:sch.length,
      cardsPerDay:+mean(runs.map(m=>(m.bubbles+m.tripCards+m.decorCards)/DAYS)).toFixed(1),
      salesPerDay:{week1:per(m=>m.sales,0,7),later:per(m=>m.sales,7,30)},
      earnedPerDay:{week1:per(m=>m.earned,0,7),later:per(m=>m.earned,7,30)},
      tripsPerDay:+mean(runs.map(m=>m.trips/DAYS)).toFixed(2),
      foodShare:[0,1,2].map(i=>+mean(runs.map(m=>m.food[i]/m.trips)).toFixed(2)),
      cappedShareOfHomeTime:+mean(runs.map(m=>m.capped/m.home)).toFixed(2),
      bubblesLostPerDay:+mean(runs.map(m=>m.lost/DAYS)).toFixed(1),
      bagBlockedPerRun:+mean(runs.map(m=>m.bagBlocked)).toFixed(2),
      soldShare:[0,1,2,3,4,5,6,7].map(i=>+mean(runs.map(m=>m.emo[i]/m.emo.reduce((a,b)=>a+b,0))).toFixed(3)),
      coinsDay30:{p50:q(runs.map(m=>m.coinsEnd[DAYS-1]),.5)},
      milestones:Object.fromEntries(Object.keys(runs[0].day).map(k=>[k,days(k)])),
      curve:{
        coins:[...Array(DAYS)].map((_,d)=>({p10:q(runs.map(m=>m.coinsEnd[d]),.1),p50:q(runs.map(m=>m.coinsEnd[d]),.5),p90:q(runs.map(m=>m.coinsEnd[d]),.9)})),
        collected:[...Array(DAYS)].map((_,d)=>({p10:q(runs.map(m=>m.collected[d]),.1),p50:q(runs.map(m=>m.collected[d]),.5),p90:q(runs.map(m=>m.collected[d]),.9)})),
        shop:[...Array(DAYS)].map((_,d)=>q(runs.map(m=>m.shopOwned[d]),.5)),
        rare:[...Array(DAYS)].map((_,d)=>q(runs.map(m=>m.rareOwned[d]),.5)),
        gifts:[...Array(DAYS)].map((_,d)=>q(runs.map(m=>m.giftsOwned[d]),.5)),
      }};});
  return {label,config:cfg,schedules:out};}
module.exports={simulate,summarize,BASE,SCHEDULES,DAYS,N};
if(require.main===module){
  const FINAL={interval:120,nightLux:true,startCoins:120,rare:[.05,.1,.2],pityAt:7,tripCards:'pair',
    places:[[7,1],[5,7],[4,7],[6,5],[2,3],[4,0]], // 海边:平静悲伤 竹林:疲惫平静 雪山:孤独平静 花田:开心疲惫 古城:愤怒迷茫 灯塔:孤独焦虑
    mods:{晴天:{6:2},阴天:{0:1.5,3:1.5},雨天:{1:2,7:1.5},returned:{5:2},decor:{6:2},lonely:{4:3}}};
  // 原版与定稿使用相同的玩家行为（睡前带豪华便当），只有规则不同
  const variants=JSON.parse(process.env.VARIANTS||'null')||{原版:{nightLux:true},定稿:FINAL,'定稿（装饰优先）':{...FINAL,policy:'decor'}};
  const res=Object.entries(variants).map(([k,v],i)=>summarize({...BASE,...v},k,SEED+i*1e7));
  const file=process.env.OUT||path.join(__dirname,'economy-results.json');fs.writeFileSync(file,JSON.stringify({runsPerSchedule:N,days:DAYS,seed:SEED,results:res},null,1));
  for(const r of res){console.log('###',r.label);for(const [s,o] of Object.entries(r.schedules)){const {curve,...rest}=o;console.log(s,JSON.stringify(rest));}}
}
