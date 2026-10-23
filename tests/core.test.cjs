const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const dir=path.resolve(__dirname,'../dist');
function setup(existing){
 let now=1800000000000,stored=existing||null,random=.3;
 class Clock extends Date{constructor(...a){super(...(a.length?a:[now]));}static now(){return now;}}
 const math=Object.create(Math);math.random=()=>random;
 const ctx=vm.createContext({Date:Clock,Math:math,localStorage:{getItem:()=>stored,setItem:(k,v)=>stored=v}});
 vm.runInContext(fs.readFileSync(path.join(dir,'data.js'),'utf8')+'\n'+fs.readFileSync(path.join(dir,'game.js'),'utf8')+'\nglobalThis.g=Game;globalThis.d=DATA;',ctx);
 return {g:ctx.g,d:ctx.d,advance:ms=>now+=ms,now:()=>now,random:r=>random=r,stored:()=>stored};
}
let passed=0;
function test(name,fn){fn();passed++;console.log('PASS '+name);}
test('94 catalog entries and all supplied text',()=>{const {d}=setup();assert.equal(d.buyers.length*2+Object.values(d.facts).flat().length+d.decorations.length+d.places.reduce((n,p)=>n+p.souvenirs.length+p.letters.length,0),94);});
test('offline bubbles cap at 3; full bag cannot consume bubble',()=>{const {g,advance}=setup();advance(12*3600000);g.tick();assert.equal(g.state.bubbles.length,3);g.state.bag=Array(20).fill('开心');assert.ok(g.collect(0).error);assert.equal(g.state.bubbles.length,3);});
test('collection restarts full bubble timer; no immediate backfill',()=>{const {g,advance}=setup();advance(100000);g.tick();g.collect(0);g.tick();assert.equal(g.state.bubbles.length,2);advance(8000);g.tick();assert.equal(g.state.bubbles.length,3);});
test('first sale 10 seconds, locked price, story does not pay until collected',()=>{const {g,advance,now}=setup();g.collect(0);g.list('开心');assert.equal(g.state.slots[0].due-now(),10000);const before=g.state.coins;advance(10000);g.tick();assert.equal(g.state.coins,before);const info=g.saleInfo(0);g.settle(0,info.fact);assert.equal(g.state.coins,before+info.price);assert.equal(g.state.freeRice,1);assert.equal(g.state.facts.length,1);assert.ok(g.settle(0,info.fact).error);assert.equal(g.state.coins,before+info.price);});
test('demand multiplier and shorter time; slots cap at 3',()=>{const {g,now}=setup();g.state.sales=1;g.state.bag=Array(4).fill('平静');for(let i=0;i<3;i++)g.list('平静');assert.ok(g.state.slots.every(s=>s.price>=30&&s.price<=45&&s.due-now()>=2000&&s.due-now()<=4000));assert.ok(g.list('平静').error);assert.equal(g.state.bag.length,1);});
test('new facts prioritized and buyer gift granted once at five visits',()=>{const {g,advance}=setup();let gifts=0;for(let i=0;i<6;i++){g.state.bag.push('开心');g.list('开心');g.state.slots[0].buyer=12;advance(10000);g.tick();const info=g.saleInfo(0),r=g.settle(0,info.fact);if(r.gift)gifts++;}assert.equal(g.state.facts.length,3);assert.equal(gifts,1);assert.equal(g.state.gifts.length,1);assert.equal(g.state.friends[12],6);});
test('purchase, first-wear bubble, no extra gold or bubble on repeated wear',()=>{const {g}=setup();g.state.coins=120;g.buy('铃铛项圈');assert.equal(g.state.coins,0);assert.equal(g.state.worn['颈部'],'铃铛项圈');assert.equal(g.state.bubbles.length,3);g.wear('铃铛项圈');g.wear('铃铛项圈');assert.equal(g.state.bubbles.length,3);assert.ok(g.buy('铃铛项圈').error);});
test('insufficient funds never changes inventory or starts a trip',()=>{const {g}=setup();g.state.coins=0;assert.ok(g.buy('小草帽').error);assert.ok(g.depart(0).error);assert.equal(g.state.trip,null);assert.equal(g.state.owned.length,0);});
test('trip free rice, no bubbles while away, halfway mail captures outfit',()=>{const {g,advance}=setup();g.state.freeRice=1;g.state.worn={'颈部':'铃铛项圈'};const coins=g.state.coins;g.depart(0);assert.equal(g.state.coins,coins);assert.equal(g.state.freeRice,0);advance(10000);g.tick();assert.equal(g.state.bubbles.length,2);assert.equal(g.state.postcards.length,1);assert.equal(g.state.postcardLooks[g.state.postcards[0]]['颈部'],'铃铛项圈');assert.ok(g.depart(0).error);assert.ok(g.pet().error);});
test('offline return grants items once; full bag queues rather than loses cards',()=>{const {g,advance}=setup();g.state.bag=Array(20).fill('开心');g.depart(0);advance(60000);g.tick();assert.equal(g.state.trip,null);assert.equal(g.state.postcards.length,1);assert.equal(g.state.souvenirs.length,1);assert.equal(g.state.parcel.length,2);assert.equal(g.state.bag.length,20);g.tick();assert.equal(g.state.parcel.length,2);g.list('开心');assert.equal(g.state.parcel.length,1);assert.equal(g.state.bag.length,20);});
test('eighth trip guarantees an unowned rare decoration',()=>{const {g,advance,random}=setup();g.state.coins=1000;random(.99);for(let i=0;i<8;i++){g.depart(0);advance(20000);g.tick();if(i<7)assert.equal(g.state.owned.length,0);}assert.equal(g.state.owned.length,1);assert.equal(g.state.pity,0);g.state.pity=7;g.depart(0);advance(20000);g.tick();assert.equal(g.state.owned.length,2);});
test('completion rewards are one-time; total money remains stable',()=>{const {g,d}=setup();g.state.owned=d.decorations.map(v=>v.name);const before=g.state.coins;g.tick();assert.equal(g.state.coins,before+100);g.tick();assert.equal(g.state.coins,before+100);assert.ok(g.state.rewards.includes(3));});
test('next day changes demand and retains inventory',()=>{const {g}=setup();g.collect(0);const old=g.state.demand;g.nextDay();assert.notEqual(g.state.demand,old);assert.equal(g.state.day,2);assert.equal(g.state.bag.length,1);});
test('local save reload preserves all resources and live trip',()=>{const a=setup();a.g.rename('团团');a.g.collect(0);a.g.depart(0);const b=setup(a.stored());assert.equal(b.g.state.name,'团团');assert.equal(b.g.state.bag.length,1);assert.ok(b.g.state.trip);assert.equal(b.g.state.coins,90);});
function clockSale(a,index=0){a.g.state.bag.push('焦虑');a.g.list('焦虑',index);a.g.state.slots[index].buyer=0;a.advance(10000);a.g.tick();return a.g.saleInfo(index);}
test('clockmaker five chapters, saved reply, gift once and later greeting',()=>{
 const a=setup();let gifts=0;
 for(let visit=1;visit<=6;visit++){
  const info=clockSale(a);assert.equal(info.visit,visit);assert.equal(a.g.state.friends[0]||0,visit-1);
  assert.equal(a.g.saleInfo(0).story.title,info.story.title);
  if(visit===3){a.g.chooseReply(0,1);const restored=setup(a.stored());assert.equal(restored.g.saleInfo(0).reply,1);}
  const before=a.g.state.coins,r=a.g.settle(0,info.fact);if(r.gift)gifts++;
  assert.equal(a.g.state.coins-before,info.price+(visit===5?50:0));
  assert.ok(a.g.settle(0,info.fact).error);
 }
 assert.equal(gifts,1);assert.equal(a.g.storyMemory(3).reply,1);assert.equal(a.g.clockStory(6).title,'熟人的问候');
});
test('all three replies have identical rewards; memory cannot unlock future chapters',()=>{
 const payouts=[];
 for(let reply=0;reply<3;reply++){const a=setup();a.g.state.friends[0]=2;const info=clockSale(a);assert.ok(a.g.chooseReply(0,reply).answer);const before=a.g.state.coins;a.g.settle(0,info.fact);payouts.push(a.g.state.coins-before);assert.equal(a.g.storyMemory(4),null);const snapshot=JSON.stringify(a.g.state);a.g.storyMemory(3);a.g.clockStory(5);assert.equal(JSON.stringify(a.g.state),snapshot);}
 assert.equal(new Set(payouts).size,1);
});
test('stale simultaneous clockmaker encounters must be reopened before settlement',()=>{
 const a=setup(),first=clockSale(a,0),second=clockSale(a,1);a.g.settle(0,first.fact);const coins=a.g.state.coins;
 assert.ok(a.g.settle(1,second.fact).error);assert.equal(a.g.state.coins,coins);assert.equal(a.g.saleInfo(1).visit,2);assert.ok(!a.g.settle(1,second.fact).error);
});
test('guide follows real progress, skip survives reload, resume preserves inventory',()=>{
 const a=setup();assert.equal(a.g.onboarding(),0);a.g.collect(0);assert.equal(a.g.onboarding(),1);a.g.list('开心');assert.equal(a.g.onboarding(),2);
 a.g.dismissGuide();assert.equal(setup(a.stored()).g.state.guideDismissed,true);a.g.dismissGuide(false);assert.equal(a.g.state.slots.filter(Boolean).length,1);
 a.advance(10000);a.g.tick();a.g.settle(0,a.g.saleInfo(0).fact);assert.equal(a.g.onboarding(),3);a.g.depart(0);assert.equal(a.g.onboarding(),4);
 a.g.reset();assert.equal(a.g.onboarding(),0);assert.equal(a.g.state.guideDismissed,false);assert.equal(a.g.storyMemory(3),null);
});
test('old saves migrate without changing money or relationship progress',()=>{
 const a=setup();a.g.state.friends[0]=3;a.g.state.coins=412;const old=JSON.parse(JSON.stringify(a.g.state));delete old.clockReplies;delete old.guideDismissed;
 const b=setup(JSON.stringify(old));assert.equal(b.g.state.coins,412);assert.equal(b.g.state.friends[0],3);assert.equal(b.g.storyMemory(3).reply,2);assert.equal(b.g.state.guideDismissed,false);
});
test('every emotion has a source; trips bring back both destination emotions',()=>{const {g,d,advance}=setup();
 const fromPlaces=new Set(d.places.flatMap(p=>p.emotions));assert.ok(['焦虑','悲伤','愤怒','迷茫','孤独','疲惫','开心','平静'].every(e=>fromPlaces.has(e)));
 g.depart(1);const place=g.state.trip.place;advance(30000);g.tick();assert.deepEqual([...g.state.returnReport.cards],[...d.places[place].emotions]);
});
console.log(`${passed} meaningful state tests passed.`);
