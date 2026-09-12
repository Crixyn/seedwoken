import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createGeographicTerrain,createLocalEcology} from '../components/world/geographic-terrain.ts';
test('actual chunk buffers have valid attributes, bounded detail and reusable resources',()=>{
 const scene=new THREE.Scene(),material=new THREE.MeshStandardMaterial(),start=performance.now(),terrain=createGeographicTerrain(scene,material,false);
 assert.equal(terrain.meshes.length,144);
 const edge=mesh=>{const g=mesh.geometry,p=g.attributes.position,n=g.attributes.normal,c=g.attributes.color;return Array.from({length:p.count},(_,i)=>i).filter(i=>p.getX(i)===-50000).map(i=>[p.getZ(i),p.getY(i),n.getX(i),n.getY(i),n.getZ(i),c.getX(i),c.getY(i),c.getZ(i)]).sort((a,b)=>a[0]-b[0]);};assert.deepEqual(edge(terrain.meshes[0]),edge(terrain.meshes[1]));
 for(let i=0;i<200;i++)terrain.update(3300,-8400,700);
 for(const mesh of terrain.meshes){const g=mesh.geometry,n=g.attributes.position.count;for(const a of Object.values(g.attributes)){assert.equal(a.count,n);assert.ok(Array.from(a.array).every(Number.isFinite));}assert.ok(Math.max(...g.index.array)<n);}
 assert.ok(terrain.stats().vertices<200000);
 const ecology=createLocalEcology(scene,false);for(let i=0;i<10;i++)ecology.update(3300,-8400,700);const populated=scene.children.length;assert.ok(populated>144);for(let i=0;i<12;i++)ecology.update(40000,40000,700);assert.ok(scene.children.length<=populated);ecology.dispose();assert.equal(scene.children.length,144);terrain.meshes.forEach(m=>m.geometry.dispose());material.dispose();console.log(JSON.stringify({cpuGeometryAndStreamingMs:Math.round(performance.now()-start),vertices:terrain.stats().vertices,note:'CPU geometry only; no GPU benchmark'}));
});
