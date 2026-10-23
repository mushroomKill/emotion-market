// Reproduce: node analysis/buyer-simulation.cjs
// Isolated relationship model. No real user data and no full-game economy simulation.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const N=20000,SEED=20261023;
function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function stats(a){const s=[...a].sort((a,b)=>a-b),q=p=>s[Math.ceil(p*s.length)-1];return {mean:Number((s.reduce((a,b)=>a+b,0)/s.length).toFixed(2)),p50:q(.5),p90:q(.9)};}
function run(anxietyShare,seed){
 const random=rng(seed),metrics={firstClock:[],nextClockGap:[],clockGift:[],firstAnyGift:[],allBuyers:[],allGifts:[]};
 let clockByDay7=0,clockByDay14=0,firstAnyByDay7=0;
 for(let r=0;r<N;r++){
  const visits=new Uint32Array(16);let seen=0,gifts=0,t=0,first=0;
  while(gifts<16&&t<10000){
   t++;const e=random()<anxietyShare?0:1+Math.floor(random()*7);
   const a=e*2,b=a+1,wa=visits[a]?1:2,wb=visits[b]?1:2;
   const buyer=random()<wa/(wa+wb)?a:b;
   if(!visits[buyer]){seen++;if(seen===16)metrics.allBuyers.push(t);}
   visits[buyer]++;
   if(buyer===0){
    if(visits[buyer]===1){first=t;metrics.firstClock.push(t);}
    if(visits[buyer]===2)metrics.nextClockGap.push(t-first);
    if(visits[buyer]===5){metrics.clockGift.push(t);if(t<=56)clockByDay7++;if(t<=112)clockByDay14++;}
   }
   if(visits[buyer]===5){gifts++;if(gifts===1){metrics.firstAnyGift.push(t);if(t<=56)firstAnyByDay7++;}if(gifts===16)metrics.allGifts.push(t);}
  }
  assert.equal(gifts,16,'simulation truncation must never silently become completion');
 }
 for(const [k,v] of Object.entries(metrics))assert.equal(v.length,N,k);
 assert.ok(Math.min(...metrics.allBuyers)>=16);assert.ok(Math.min(...metrics.allGifts)>=80);
 assert.ok(Math.min(...metrics.firstAnyGift)>=5);
 return {anxietyShare,metrics:Object.fromEntries(Object.entries(metrics).map(([k,v])=>[k,stats(v)])),atEightSalesPerDay:{clockGiftByDay7:clockByDay7/N,clockGiftByDay14:clockByDay14/N,anyGiftByDay7:firstAnyByDay7/N}};
}
const scenarios=[run(.125,SEED),run(.0625,SEED+1),run(.25,SEED+2)];
const result={runsPerScenario:N,seed:SEED,model:'16 buyers; two per emotion; unseen weight 2 versus seen weight 1; gift at fifth settled sale; independent supplied emotion draws; other 7 emotions equally split',scenarios};
const root=__dirname;fs.writeFileSync(path.join(root,'buyer-results.json'),JSON.stringify(result,null,2));
const names={firstClock:'首次遇见钟表匠',nextClockGap:'第一次到第二次见钟表匠的间隔',clockGift:'获得钟表匠回礼',firstAnyGift:'获得任意第一份回礼',allBuyers:'见齐 16 位买家',allGifts:'获得全部 16 份回礼'};
const base=scenarios[0];const days=(x,n)=>Math.ceil(x/n);
let md='# 买家关系数值验证 · 第一轮\n\n**全部为模拟结果，不是真实用户数据。**\n\n## 方法与假设\n\n- 每个情境模拟 20,000 个独立进程，固定随机种子，结果可复现。\n- 按当前 demo 的买家规则：每种情绪两位买家，未见权重 2，已见权重 1；第五笔已领取交易获得回礼。\n- 基线假设每种上架情绪占 1/8，交易情绪独立抽取。实际天气、旅行、背包、行情与选卡行为会改变这一比例，本轮没有模拟这些系统。\n- 所有上架交易都最终结算；不模拟访客看完故事或主动回访的概率。\n- 每天 4 / 8 / 12 笔只是固定成交预算的敏感性分析，不是已验证的资源供给或用户分群。天数按 ceil(交易序号/每日成交数) 映射，从第 1 天开始；间隔指标对应交易量，不代表自然等待时长。\n- P50：约一半模拟进程达到该结果的交易数；P90：约九成达到，仍有约一成需要更久。\n\n## 基线结果\n\n| 指标 | 平均交易数 | P50 | P90 | 每日 8 笔时 P50 / P90（天或间隔等效天数） |\n|---|---:|---:|---:|---:|\n';
for(const [k,s] of Object.entries(base.metrics))md+=`| ${names[k]} | ${s.mean} | ${s.p50} | ${s.p90} | ${days(s.p50,8)} / ${days(s.p90,8)} |\n`;
md+='\n## 指定回礼对参与量的敏感性\n\n| 每日成交预算 | 获得钟表匠回礼 P50（第几天） | P90（第几天） |\n|---|---:|---:|\n';
for(const n of [4,8,12])md+=`| ${n} | ${days(base.metrics.clockGift.p50,n)} | ${days(base.metrics.clockGift.p90,n)} |\n`;
md+='\n## 指定回礼对焦虑卡占比的敏感性\n\n其他七种情绪平分剩余份额，规则不变。\n\n| 焦虑卡占比 | 钟表匠回礼 P50 / P90（交易数） | 每日 8 笔时 P50 / P90（天） |\n|---|---:|---:|\n';
for(const x of scenarios){const s=x.metrics.clockGift;md+=`| ${x.anxietyShare*100}% | ${s.p50} / ${s.p90} | ${days(s.p50,8)} / ${days(s.p90,8)} |\n`;}
md+='\n## 解释边界与设计用途\n\n- 这组结果用于检查随机相遇与连续剧情是否相容，不用于证明留存提升或心理健康效果。\n- “第一份回礼”与“喜欢的那位买家的回礼”是不同目标，不能用前者代替后者的体验。\n- 若剧情依赖连续记忆，应保留已解锁故事回看，并在再次相遇时用短句承接前情。\n- 是否需要主动回访、相遇保障或降低次数，尚未决策；本轮没有改动游戏规则。\n- 后续将实际情绪供给和会话日程接入模型，才能评估金币、卡片容量、市场周转共同影响下的节奏。\n\n复现：在项目根目录运行 `node analysis/buyer-simulation.cjs`。原始结果见 `buyer-results.json`。\n';
fs.writeFileSync(path.join(root,'买家关系数值验证.md'),md);
console.log(JSON.stringify({runsPerScenario:N,baseline:base,emotionSensitivity:scenarios.map(x=>({share:x.anxietyShare,clockGift:x.metrics.clockGift}))},null,2));
