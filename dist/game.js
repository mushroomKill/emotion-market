'use strict';
const Game = (() => {
  const KEY = 'emotion-market-v1';
  const choose = a => a[Math.floor(Math.random()*a.length)];
  const weighted = (items, weights) => {
    let n = Math.random()*weights.reduce((a,b)=>a+b,0);
    for(let i=0;i<items.length;i++){n-=weights[i];if(n<0)return items[i];}
    return items[items.length-1];
  };
  const weather = () => weighted(['晴天','阴天','雨天'],[2,1,1]);
  const fresh = (now=Date.now()) => ({version:1,name:'小橘',named:false,coins:80,day:1,weather:weather(),demand:'平静',bag:[],bubbles:['开心','焦虑'],slots:[null,null,null],lastBubble:now,lastSeen:now,petAt:0,petSession:false,lonely:false,newDecorUntil:0,returnedUntil:0,trip:null,postcards:[],unread:[],souvenirs:[],owned:[],worn:{},wornEver:[],friends:{},gifts:[],facts:[],rewards:[],sales:0,freeRice:0,pity:0,parcel:[],returnReport:null,startedTrips:0,tutorial:0});
  let state;
  let storageOK=true;
  try{const raw=localStorage.getItem(KEY);state=raw?JSON.parse(raw):fresh();if(state.version!==1||!Array.isArray(state.bag)||!Array.isArray(state.slots))throw Error('invalid');}catch{state=fresh();}
  state.petSession=false;
  state.clockReplies??={};
  state.guideDismissed??=false;
  if(Date.now()-state.lastSeen>12*3600000)state.lonely=true;
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{storageOK=false;}}
  function add(arr,item){if(!arr.includes(item))arr.push(item);}
  function emotion(now){
    const w=DATA.emotions.map(e=>{
      let x=1;
      if(state.weather==='晴天'&&e==='开心')x*=2;
      if(state.weather==='阴天'&&['迷茫','疲惫'].includes(e))x*=1.5;
      if(state.weather==='雨天'){if(e==='悲伤')x*=2;if(e==='平静')x*=1.5;}
      if(now<state.returnedUntil&&['开心','疲惫'].includes(e))x*=2;
      if(now<state.newDecorUntil&&e==='开心')x*=2;
      if(state.lonely&&e==='孤独')x*=3;
      if(state.petSession&&e==='平静')x*=1.5;
      return x;
    });
    const e=weighted(DATA.emotions,w);state.lonely=false;return e;
  }
  function counts(){return [Object.keys(state.friends).length,state.gifts.length,state.facts.length,state.owned.length,state.souvenirs.length,state.postcards.length];}
  function checkRewards(){counts().forEach((v,i)=>{if(v===[16,16,24,14,12,12][i]&&!state.rewards.includes(i)){state.rewards.push(i);state.coins+=100;}});}
  function flushParcel(){while(state.parcel.length&&state.bag.length<20)state.bag.push(state.parcel.shift());}
  function tick(now=Date.now()){
    const events=[];
    for(const slot of state.slots){
      if(slot&&!slot.ready&&now>=slot.due){slot.ready=true;events.push('sale');}
    }
    if(state.trip){
      const t=state.trip,p=DATA.places[t.place];
      if(!t.mailed&&now>=t.start+(t.end-t.start)/2){
        const ids=[`${t.place}-0`,`${t.place}-1`],unseen=ids.filter(i=>!state.postcards.includes(i));
        const id=choose(unseen.length?unseen:ids);add(state.postcards,id);add(state.unread,id);
        state.postcardLooks??={};state.postcardLooks[id]={...t.worn};
        t.mailed=true;events.push('mail');
      }
      if(now>=t.end){
        const s=weighted(p.souvenirs,p.souvenirs.map(v=>state.souvenirs.includes(v)?1:3));
        const repeat=state.souvenirs.includes(s);if(repeat)state.coins+=20;else add(state.souvenirs,s);
        const cards=[choose(p.emotions),choose(['开心','疲惫'])];state.parcel.push(...cards);flushParcel();
        let rare=null;
        if(state.pity>=5||Math.random()<[.1,.2,.35][t.food]){
          const missing=DATA.decorations.filter(d=>!d.price&&!state.owned.includes(d.name));
          rare=!state.owned.includes(p.rare)?p.rare:missing.length?choose(missing).name:null;
          if(rare)add(state.owned,rare);state.pity=0;
        }else state.pity++;
        state.returnReport={place:p.name,souvenir:s,repeat,cards,rare};
        state.trip=null;state.returnedUntil=t.end+360000;state.lastBubble=t.end;events.push('home');
      }
    }
    if(!state.trip){
      const elapsed=Math.floor((now-state.lastBubble)/8000),space=3-state.bubbles.length;
      if(elapsed>0){
        const n=Math.min(elapsed,space);
        for(let i=0;i<n;i++){state.bubbles.push(emotion(state.lastBubble+(i+1)*8000));events.push('bubble');}
        state.lastBubble=state.bubbles.length===3?now:state.lastBubble+elapsed*8000;
      }
    }
    checkRewards();save();return events;
  }
  function collect(i){
    if(state.trip)return {error:'小猫正在旅行，回来后再收情绪吧。'};
    if(state.bag.length>=20)return {error:'背包满啦，先去市场卖掉一些吧。'};
    const e=state.bubbles[i];if(!e)return {error:'这颗泡泡已经收好啦。'};
    if(state.bubbles.length===3)state.lastBubble=Date.now();
    state.bubbles.splice(i,1);state.bag.push(e);state.tutorial=Math.max(1,state.tutorial);save();
    let quote=choose(DATA.quotes[e]);
    if(e==='焦虑'&&state.weather!=='雨天')quote=DATA.quotes[e][1];
    if(e==='悲伤'&&state.weather!=='雨天')quote=DATA.quotes[e][1];
    if(e==='平静'&&state.weather!=='雨天')quote=DATA.quotes[e][1];
    return {emotion:e,quote};
  }
  function pet(now=Date.now()){
    if(state.trip)return {error:'小猫在路上，会想你的。'};
    if(now-state.petAt<10000)return {error:'呼噜……让我再眯一小会儿。'};
    state.petAt=now;state.petSession=true;save();
    return {quote:choose(['呼噜呼噜……','再摸一下嘛。','（眯起了眼睛）','你今天过得好吗？'])};
  }
  function list(e,slotIndex,now=Date.now()){
    const i=state.bag.indexOf(e),n=slotIndex??state.slots.findIndex(v=>!v);
    if(i<0)return {error:'背包里没有这张情绪卡。'};
    if(n<0||state.slots[n])return {error:'三个柜台都摆满了，等客人来吧。'};
    const hot=e===state.demand,first=state.sales===0&&state.slots.every(v=>!v);
    const buyers=DATA.buyers.map((b,i)=>({...b,id:i})).filter(b=>b.emotion===e);
    const buyer=weighted(buyers,buyers.map(b=>state.friends[b.id]?1:2)).id;
    state.bag.splice(i,1);flushParcel();
    const duration=first?10000:(4000+Math.random()*4000)/(hot?2:1);
    const price=Math.round((20+Math.floor(Math.random()*11))*(hot?1.5:1));
    state.slots[n]={emotion:e,start:now,due:now+duration,ready:false,buyer,price};
    state.tutorial=Math.max(2,state.tutorial);save();return {slot:n};
  }
  function saleInfo(i){
    const s=state.slots[i];if(!s?.ready)return null;
    const e=DATA.emotions.indexOf(s.emotion),all=[0,1,2].map(j=>`${e}-${j}`);
    const fact=all.find(id=>!state.facts.includes(id))||choose(all);
    const visit=(state.friends[s.buyer]||0)+1;
    if(s.storyVisit!==visit){s.storyVisit=visit;delete s.reply;save();}
    return {...s,fact,visit,buyerData:DATA.buyers[s.buyer],story:s.buyer===0?clockStory(visit):null};
  }
  function clockStory(visit){
    const stories=[
      {title:'还漏了什么',recap:'今晚，他第一次在小摊前停下。',line:'明天要交的钟，我总觉得还漏了什么。',after:'他收下这份焦虑，带回了亮着灯的工作台。'},
      {title:'那颗松动的螺丝',recap:'上次，他担心没检查好即将交付的钟。',line:'上次我又检查了一遍，真的找到一颗松动的螺丝。',after:'“你还记得我吧？”他把工具袋放在柜台边。'},
      {title:'已经检查过了',recap:'他找到了松动的螺丝，也已经把它拧紧。',line:'螺丝都拧紧了，可我还是忍不住检查。',after:'你可以回应他，也可以静静听他说。'},
      {title:'一只未完成的怀表',recap:'上次，钟表修好了，他的担心却还没有停。',line:'我把检查过的地方记下来了。今晚想早点关灯。',after:'他袋子里露出一只未完成的怀表。似乎是为你准备的。'},
      {title:'慢半拍，也没关系',recap:'上次，他开始记录检查过的地方，也准备了一份小礼物。',line:'送你这只慢半拍的表。它偶尔会提醒我，不必每一秒都赶上。',after:'他把怀表轻轻放到柜台上。这是你们第五次相遇。'}
    ];
    if(!Number.isInteger(visit)||visit<1)return null;
    return visit>5?{title:'熟人的问候',recap:'那只慢半拍的怀表，已经陪你走过一些日子。',line:'今天，店里的钟也在慢慢走。',after:'他收下这份心情，和你道了晚安。'}:stories[visit-1];
  }
  const replies=[
    {label:'你已经检查很仔细了。',answer:'你记得我上次说的事啊。谢谢。'},
    {label:'你还在担心什么？',answer:'也许是怕让等着取钟的人失望。'},
    {label:'继续听他讲',answer:'说着说着，他把手里的工具放下了一会儿。'}
  ];
  function chooseReply(i,reply){
    const s=state.slots[i];
    if(!s?.ready||s.buyer!==0||s.storyVisit!==3||state.friends[0]!==2||![0,1,2].includes(reply))return {error:'这次相遇暂时不需要选择回应。'};
    s.reply=reply;save();return {answer:replies[reply].answer};
  }
  function storyMemory(visit){
    if(!Number.isInteger(visit)||visit<1||visit>Math.min(5,state.friends[0]||0))return null;
    return {...clockStory(visit),reply:state.clockReplies[visit]??2};
  }
  function onboarding(){
    if(state.sales===0){if(state.slots.some(Boolean))return 2;return state.bag.length?1:0;}
    return state.startedTrips?4:3;
  }
  function dismissGuide(value=true){state.guideDismissed=value;save();}
  function settle(i,fact){
    const s=state.slots[i];if(!s?.ready)return {error:'这笔交易已经收好啦。'};
    if(s.buyer===0&&s.storyVisit!==undefined&&s.storyVisit!==(state.friends[0]||0)+1)return {error:'相遇进度更新了，请重新打开这笔交易。'};
    const e=DATA.emotions.indexOf(s.emotion);if(![0,1,2].some(j=>fact===`${e}-${j}`))return {error:'请先读这份心情的小百科。'};
    const b=DATA.buyers[s.buyer];state.coins+=s.price;add(state.facts,fact);
    state.friends[s.buyer]=(state.friends[s.buyer]||0)+1;
    if(s.buyer===0&&state.friends[0]===3)state.clockReplies[3]=s.reply??2;
    let gift=null;if(state.friends[s.buyer]>=5&&!state.gifts.includes(b.gift)){add(state.gifts,b.gift);state.coins+=50;gift=b.gift;}
    state.sales++;state.slots[i]=null;if(state.sales===1){state.freeRice++;state.tutorial=3;}
    checkRewards();save();return {coins:s.price,gift,first:state.sales===1};
  }
  function wear(name,now=Date.now()){
    const d=DATA.decorations.find(d=>d.name===name);if(!d||!state.owned.includes(name))return {error:'还没有这件装饰。'};
    if(state.trip)return {error:'等小猫回家，再试试新衣服吧。'};
    if(state.worn[d.slot]===name){delete state.worn[d.slot];save();return {removed:true};}
    state.worn[d.slot]=name;
    const first=!state.wornEver.includes(name);
    if(first){add(state.wornEver,name);state.newDecorUntil=now+120000;if(state.bubbles.length<3)state.bubbles.push('开心');else if(state.bag.length<20)state.bag.push('开心');else state.parcel.push('开心');}
    save();return {first};
  }
  function buy(name){
    const d=DATA.decorations.find(d=>d.name===name);if(!d?.price)return {error:'这件装饰要在旅行中遇见。'};
    if(state.owned.includes(name))return {error:'这件装饰已经在衣柜里啦。'};
    if(state.coins<d.price)return {error:`还差 ${d.price-state.coins} 金币，去市场摆摊吧。`};
    state.coins-=d.price;add(state.owned,name);checkRewards();save();
    return state.trip?{stored:true}:wear(name);
  }
  function depart(food,now=Date.now()){
    if(state.trip)return {error:'小猫还在旅行中。'};
    if(![0,1,2].includes(food))return {error:'先选一份便当。'};
    const price=[30,60,100][food],free=food===0&&state.freeRice>0;
    if(!free&&state.coins<price)return {error:'金币还不够，先去市场摆摊吧。'};
    const place=weighted([0,1,2,3,4,5],DATA.places.map((p,i)=>!state.owned.includes(p.rare)||p.souvenirs.some(s=>!state.souvenirs.includes(s))||[0,1].some(j=>!state.postcards.includes(`${i}-${j}`))?2:1));
    if(free)state.freeRice--;else state.coins-=price;
    state.trip={place,food,start:now,end:now+[20000,30000,40000][food],mailed:false,worn:{...state.worn}};
    state.startedTrips++;state.tutorial=4;state.returnReport=null;state.lastBubble=now;save();return {ok:true};
  }
  function nextDay(){state.day++;state.weather=weather();state.demand=choose(DATA.emotions.filter(e=>e!==state.demand));save();}
  function seenMail(id){state.unread=state.unread.filter(v=>v!==id);save();}
  function rename(name){state.name=name.trim().slice(0,12)||'小橘';state.named=true;save();}
  function visit(){state.lastSeen=Date.now();save();}
  function reset(){state=fresh();state.clockReplies={};state.guideDismissed=false;save();}
  return {get state(){return state;},get storageOK(){return storageOK;},tick,save,collect,pet,list,saleInfo,settle,wear,buy,depart,nextDay,seenMail,rename,visit,reset,counts,fresh,KEY,clockStory,replies,chooseReply,storyMemory,onboarding,dismissGuide};
})();
