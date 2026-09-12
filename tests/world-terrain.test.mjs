import test from 'node:test';
import assert from 'node:assert/strict';
import {sample,riverLevel,coast} from '../components/world/terrain.mjs';
test('all six terrain grids remain finite, deterministic and bounded including ocean edges',()=>{
 for(const id of ['elaris','sahrel','caelune','vulkara','thyrra','nythrune'])for(let x=-1050;x<=1050;x+=75)for(let z=-1050;z<=1050;z+=75){const a=sample(id,x,z),b=sample(id,x,z);assert.deepEqual(a,b);assert.ok(Number.isFinite(a.height)&&a.height>=-40&&a.height<800);assert.ok(a.water>=0);}
});
test('the main southward watersheds descend rather than running uphill',()=>{
 for(const id of ['elaris','caelune','sahrel','nythrune']){let previous=Infinity;for(let z=-.8;z<=.9;z+=.01){const level=riverLevel(id,z);assert.ok(level<=previous);previous=level;}}
});
test('Caelune has a higher crown than the sampled Elaris highlands',()=>{
 let crown=0,mainland=0;for(let x=-.3;x<.3;x+=.015)for(let z=-.8;z<-.25;z+=.015){crown=Math.max(crown,sample('caelune',x*900,z*900).height);mainland=Math.max(mainland,sample('elaris',x*900,z*900).height);}assert.ok(crown>mainland*1.5);
});
test('Thyrra contains separated islands rather than one solid landmass',()=>{
 assert.ok(coast('thyrra',0,-.52)>0);assert.ok(coast('thyrra',-.37,.02)>0);assert.ok(coast('thyrra',-.7,-.2)<0);assert.ok(coast('thyrra',.9,.9)<0);
});
