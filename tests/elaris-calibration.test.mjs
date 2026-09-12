import test from 'node:test';import assert from 'node:assert/strict';
import {elaris,segmentDistance} from '../components/world/geography.mjs';
import {terrainTopology} from '../components/world/geographic-terrain.ts';
const length=points=>points.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p[0]-points[i][0],p[1]-points[i][1]),0);
test('calibrated courses retain all reference controls and stay inside their reference corridor',()=>{
 for(const r of elaris.rivers){const original=elaris.data.hydrology.rivers.find(x=>x.id===r.id);for(const a of original.points)assert.ok(r.points.some(b=>Math.hypot(a[0]-b[0],a[1]-b[1])<1e-9));let drift=0;for(const p of r.points){const d=Math.min(...original.points.slice(1).map((b,i)=>segmentDistance(p[0],p[1],original.points[i],b).distance));drift=Math.max(drift,d);}assert.ok(drift<.02,`${r.id}: drift ${drift}`);assert.ok(length(r.points)<length(original.points)*1.1);}
});
test('channel width and depth vary and tributaries stay smaller than receiving rivers',()=>{
 for(const r of elaris.rivers){const widths=r.stations.map(s=>s.width);assert.ok(Math.max(...widths)/Math.min(...widths)>1.3);assert.ok(r.stations.every(s=>s.depth>0&&s.valleyWidth>s.width*4));if(r.outlet){const receiving=elaris.rivers.find(x=>x.id===r.outlet),end=r.stations.at(-1),target=receiving.stations.reduce((a,b)=>Math.abs(a.z-end.z)<Math.abs(b.z-end.z)?a:b);assert.ok(end.width<target.width*.9,`${r.id} too wide`);}}
});
test('irregular lakes retain outlet position, closed boundaries and submerged interiors',()=>{
 for(const l of elaris.lakeShapes){const ratios=l.points.map(([x,z])=>Math.hypot((x-l.x)/l.rx,(z-l.z)/l.rz));assert.ok(Math.max(...ratios)-Math.min(...ratios)>.08);assert.ok(ratios.every(r=>r>.6&&r<1.5));const outlet=elaris.data.hydrology.rivers.find(r=>r.id===l.outlet).points[0],a=Math.atan2((outlet[1]-l.z)/l.rz,(outlet[0]-l.x)/l.rx);assert.ok(Math.abs(l.radius(a)-1)<1e-9);for(const [x,z]of l.points){const p=elaris.surface(l.x+(x-l.x)*.97,l.z+(z-l.z)*.97);assert.ok(p.height<l.level);}}
});
test('all LOD boundaries are identical and zipper triangles cover each tile without holes',()=>{
 let boundary;for(const n of [8,24,64,96]){const t=terrainTopology(10000,n,32),ring=t.outer.map(i=>t.points[i]);if(boundary)assert.deepEqual(ring,boundary);boundary=ring;let area=0;const edges=new Map();for(let i=0;i<t.indices.length;i+=3){const ids=t.indices.slice(i,i+3),[a,b,c]=ids.map(j=>t.points[j]),cross=(b[1]-a[1])*(c[0]-a[0])-(b[0]-a[0])*(c[1]-a[1]);assert.ok(cross>0,'flipped or degenerate triangle');area+=cross/2;for(let k=0;k<3;k++){const p=ids[k],q=ids[(k+1)%3],key=Math.min(p,q)+':'+Math.max(p,q);edges.set(key,(edges.get(key)||0)+1);}}assert.ok(Math.abs(area-100000000)<.1);assert.equal([...edges.values()].filter(v=>v===1).length,128);assert.ok([...edges.values()].every(v=>v===1||v===2));}
});
