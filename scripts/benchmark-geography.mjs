import {execFileSync} from 'node:child_process';import {writeFileSync} from 'node:fs';import {elaris} from '../components/world/geography.mjs';
const reference=new URL('../components/world/elaris-geography.mjs',import.meta.url).href;
const original=execFileSync('git',['show','rollback-before-elaris-m22-20260911:components/world/geography.mjs'],{encoding:'utf8'}).replace("'./elaris-geography.mjs'",JSON.stringify(reference)).replace("'./hydromorphology.mjs'",JSON.stringify(new URL('../components/world/hydromorphology.mjs',import.meta.url).href));
const baseline=(await import('data:text/javascript;base64,'+Buffer.from(original).toString('base64'))).elaris;
const points=Array.from({length:10000},(_,i)=>[((i%100)/99*1.8-.9)*60000,(Math.floor(i/100)/99*1.8-.9)*60000]);
const run=model=>{const t=performance.now();let checksum=0;for(const [x,z]of points)checksum+=model.sample(x,z).height;return {ms:performance.now()-t,checksum};};run(baseline);run(elaris);
const before=[],after=[];for(let i=0;i<5;i++){before.push(run(baseline).ms);after.push(run(elaris).ms);}const median=v=>v.sort((a,b)=>a-b)[2];
const b=median(before),a=median(after),report={scope:'CPU sampling only; same 10000 locations; 5 interleaved warm runs',baselineMedianMs:Math.round(b),calibratedMedianMs:Math.round(a),ratio:Number((a/b).toFixed(3)),baseline:'Milestone 2.1',revision:'Milestone 2.2',userReportedBaselineFPS:null,mobileBaselineSnapshotFPS:60,calibratedGPUFPS:null,calibratedVisualVerification:'pending local PC review'};
writeFileSync(new URL('../public/world/elaris-performance.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
