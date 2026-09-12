import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {elaris,createGeography,validateGeography} from '../components/world/geography.mjs';
import {analyzeDrainage} from '../components/world/drainage.mjs';
const data=elaris.data;
test('Elaris trace retains reference anchors and an enlarged evaluation domain',()=>{
 assert.equal(data.registration.sourceId,'codex-plate-elaris');assert.equal(elaris.extent,60000);
 // Independent reference-image observations, not points copied from the polygon.
 for(const [u,v]of [[.55,.44],[.42,.4],[.75,.48],[.50,.10],[.69,.08],[.2,.81],[.65,.86]])assert.ok(elaris.coast(u*2-1,v*2-1)>0,`expected land at ${u},${v}`);
 for(const [u,v]of [[.1,.1],[.30,.78],[.98,.5],[.35,.95]])assert.ok(elaris.coast(u*2-1,v*2-1)<0,`expected ocean at ${u},${v}`);
});
test('traced river beds remain below descending water at every sampled bend',()=>{
 for(const river of elaris.rivers){let previous=Infinity;for(let i=1;i<river.points.length;i++)for(let j=0;j<=20;j++){const t=j/20,x=river.points[i-1][0]*(1-t)+river.points[i][0]*t,z=river.points[i-1][1]*(1-t)+river.points[i][1]*t,p=elaris.surface(x,z),level=elaris.level(z);assert.ok(level<=previous+1e-8);previous=level;if(p.coast>0)assert.ok(p.height<level,`${river.id} exposed bed at ${x},${z}`);}}
});
test('tributaries meet their downstream channel and lake outlets share its level',()=>{
 for(const river of data.hydrology.rivers.filter(r=>r.outlet)){const end=river.points.at(-1),down=data.hydrology.rivers.find(r=>r.id===river.outlet);assert.ok(down.points.some(p=>Math.hypot(p[0]-end[0],p[1]-end[1])<1e-8));}
 for(const lake of data.hydrology.lakes){const river=data.hydrology.rivers.find(r=>r.id===lake.outlet),start=river.points[0];assert.ok(Math.abs(start[1]-lake.outletZ)<1e-8);assert.ok(Math.abs(Math.hypot((start[0]-lake.x)/lake.rx,(start[1]-lake.z)/lake.rz)-1)<.04);assert.equal(elaris.surface(lake.x,lake.z).water,elaris.level(lake.outletZ));}
});
test('terrain is continuous across chunk boundaries and environmental indices are bounded',()=>{
 const biomes=new Set();for(let z=-.9;z<.9;z+=.065)for(let x=-.9;x<.9;x+=.065){const a=elaris.sample(x*60000,z*60000),b=elaris.sample(x*60000+.001,z*60000);assert.ok(Number.isFinite(a.height));assert.ok(Math.abs(a.height-b.height)<.1);assert.ok(a.moisture>=0&&a.moisture<=1&&a.treeDensity>=0&&a.treeDensity<=1);biomes.add(a.biome);}for(const b of ['snow','boreal','forest','wetland','coast'])assert.ok(biomes.has(b));
});
test('climate and cover respond to elevation and a mountain rain shadow',()=>{
 const ridge=elaris.sample(.29*60000,-.83*60000),valley=elaris.sample(.055*60000,-.14*60000);assert.ok(ridge.height>valley.height+1500);assert.ok(ridge.temperature<valley.temperature);assert.equal(ridge.treeDensity,0);
 const shadow=elaris.sample(.66*60000,-.10*60000),west=elaris.sample(.1*60000,-.10*60000);assert.ok(shadow.rainShadow>west.rainShadow);
});
test('priority flood has no cycles or uphill flow and conserves contributing area',()=>{
 const grid=analyzeDrainage(elaris,65);let terminalArea=0;for(let i=0;i<grid.flow.length;i++){const j=grid.flow[i];if(j<0)terminalArea+=grid.accumulation[i];else{assert.ok(grid.filled[j]<=grid.filled[i]);let cursor=i,steps=0;while(cursor>=0&&steps<=grid.flow.length){cursor=grid.flow[cursor];steps++;}assert.ok(steps<=grid.flow.length);}}
 assert.equal(terminalArea,65*65);
});
test('compiler accepts independent structured inputs without continent-specific branches',()=>{
 const fixture=structuredClone(data);fixture.id='pipeline-fixture';fixture.seed+=3;fixture.mountains=[];const model=createGeography(fixture);assert.ok(model.sample(.29*60000,-.83*60000).height<elaris.sample(.29*60000,-.83*60000).height-1000);assert.equal(model.data.id,'pipeline-fixture');
 fixture.hydrology.rivers[1].outlet='missing';assert.throws(()=>validateGeography(fixture),/Missing downstream/);
});
test('archive and other-continent terrain are byte-identical to the rollback baseline',()=>{
 for(const path of ['public/world/archive.json','components/world/terrain.mjs','components/world/world-data.ts','.openai/hosting.json','db/schema.ts']){const before=execFileSync('git',['show',`rollback-before-elaris-m2-20260910:${path}`]);assert.deepEqual(readFileSync(new URL('../'+path,import.meta.url)),before);}
 const archive=JSON.parse(readFileSync(new URL('../public/world/archive.json',import.meta.url)));assert.equal(archive.records.length,233);for(const link of data.spatialLinks){assert.ok(link.sourceIds.every(id=>archive.records.some(r=>r.id===id)));if(link.entityType==='species'){assert.equal(link.status,'UNKNOWN');assert.equal(link.continent,null);assert.equal(link.region,null);}}
});
