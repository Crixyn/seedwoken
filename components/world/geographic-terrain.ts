import * as THREE from 'three';
import {insertTerrainConstraints} from './terrain-constraints.mjs';
import {elaris,geographyColor} from './geography.mjs';

// All LODs share the same boundary ring. A zipper triangulation connects it to
// each interior resolution, with world-gradient normals independent of LOD.
export function terrainTopology(span:number,segments:number,edgeSegments:number){
 const points:Array<[number,number]>=[],indices:number[]=[],inner:number[]=[],outer:number[]=[];
 const count=segments-1;
 for(let z=1;z<segments;z++)for(let x=1;x<segments;x++)points.push([-span/2+x*span/segments,-span/2+z*span/segments]);
 for(let z=0;z<count-1;z++)for(let x=0;x<count-1;x++){const a=z*count+x,b=a+1,c=a+count,d=c+1;indices.push(a,c,b,b,c,d);}
 for(let x=0;x<count-1;x++)inner.push(x);
 for(let z=0;z<count-1;z++)inner.push(z*count+count-1);
 for(let x=count-1;x>0;x--)inner.push((count-1)*count+x);
 for(let z=count-1;z>0;z--)inner.push(z*count);
 for(let side=0;side<4;side++)for(let i=0;i<edgeSegments;i++){const t=i/edgeSegments;outer.push(points.length);points.push(side===0?[-span/2+t*span,-span/2]:side===1?[span/2,-span/2+t*span]:side===2?[span/2-t*span,span/2]:[-span/2,span/2-t*span]);}
 let a=0,b=0;while(a<outer.length||b<inner.length){const oa=outer[a%outer.length],ib=inner[b%inner.length],nextA=(a+1)/outer.length,nextB=(b+1)/inner.length;if(a<outer.length&&(b===inner.length||nextA<=nextB)){indices.push(oa,ib,outer[(a+1)%outer.length]);a++;}else{indices.push(oa,ib,inner[(b+1)%inner.length]);b++;}}
 return {points,indices,outer};
}
export function createGeographicTerrain(scene:THREE.Scene,material:THREE.Material,high:boolean){
 const n=12,span=elaris.extent*2/n,edges=high?64:32,tiles:Array<{mesh:THREE.Mesh;cx:number;cz:number;segments:number}>=[],edgeCache=new Map<string,ReturnType<typeof elaris.sample>>();
 const layouts=new Map<number,ReturnType<typeof terrainTopology>>();
 const layout=(segments:number)=>{if(!layouts.has(segments))layouts.set(segments,terrainTopology(span,segments,edges));return layouts.get(segments)!;};
 const constrained=new Map<string,ReturnType<typeof terrainTopology>>();
 const constraintPoints=elaris.rivers.flatMap(r=>r.stations.flatMap(p=>[-1.4,-.75,0,.75,1.4].map(c=>[(p.x-p.tz*p.width*c)*elaris.extent,(p.z+p.tx*p.width*c)*elaris.extent]))).concat(elaris.lakeShapes.flatMap(l=>l.points.flatMap(([x,z])=>[.96,1.06].map(r=>[(l.x+(x-l.x)*r)*elaris.extent,(l.z+(z-l.z)*r)*elaris.extent]))));
 function tileLayout(cx:number,cz:number,segments:number){const key=cx+':'+cz+':'+segments;if(!constrained.has(key)){const points=constraintPoints.filter(p=>Math.abs(p[0]-cx)<span/2-1&&Math.abs(p[1]-cz)<span/2-1).map(p=>[p[0]-cx,p[1]-cz]);constrained.set(key,insertTerrainConstraints(layout(segments),points));}return constrained.get(key)!;}
 function pointSample(cx:number,cz:number,p:[number,number]){const x=cx+p[0],z=cz+p[1],edge=Math.abs(p[0])===span/2||Math.abs(p[1])===span/2,key=x+':'+z;if(edge&&edgeCache.has(key))return edgeCache.get(key)!;const value=elaris.sample(x,z);if(edge)edgeCache.set(key,value);return value;}
 function geometry(cx:number,cz:number,segments:number,samples?:ReturnType<typeof elaris.sample>[]){const topology=tileLayout(cx,cz,segments),g=new THREE.BufferGeometry(),positions:number[]=[],colors:number[]=[],normals:number[]=[];
 topology.points.forEach((p,i)=>{const s=samples?.[i]||pointSample(cx,cz,p),normal=new THREE.Vector3(-s.gradientX,1,-s.gradientZ).normalize();positions.push(cx+p[0],s.height,cz+p[1]);colors.push(...geographyColor(s));normals.push(normal.x,normal.y,normal.z);});g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.setIndex(topology.indices);g.computeBoundingSphere();return g;}
 for(let z=0;z<n;z++)for(let x=0;x<n;x++){const cx=-elaris.extent+(x+.5)*span,cz=-elaris.extent+(z+.5)*span,mesh=new THREE.Mesh(geometry(cx,cz,8),material);mesh.receiveShadow=true;scene.add(mesh);tiles.push({mesh,cx,cz,segments:8});}
 let pending:{tile:typeof tiles[number];segments:number;index:number;samples:ReturnType<typeof elaris.sample>[]} | null=null;
 function update(x:number,z:number,altitude:number){if(pending){const job=pending;if(Math.hypot(job.tile.cx-x,job.tile.cz-z)>span*4&&job.segments>8){pending=null;}else{const start=performance.now(),points=tileLayout(job.tile.cx,job.tile.cz,job.segments).points;while(job.index<points.length&&performance.now()-start<4)job.samples.push(pointSample(job.tile.cx,job.tile.cz,points[job.index++]));if(job.index===points.length){const old=job.tile.mesh.geometry;job.tile.mesh.geometry=geometry(job.tile.cx,job.tile.cz,job.segments,job.samples);job.tile.segments=job.segments;old.dispose();pending=null;}return;}}
 let selected:typeof tiles[number]|undefined,desired=8,priority=-Infinity;for(const t of tiles){const distance=Math.hypot(t.cx-x,t.cz-z),lod=distance<span*1.2&&altitude<9000?(high?96:64):distance<span*2.5?24:8;if(lod!==t.segments){const score=(lod>t.segments?1000000:0)-distance;if(score>priority){priority=score;selected=t;desired=lod;}}}if(selected)pending={tile:selected,segments:desired,index:0,samples:[]};}
 return {meshes:tiles.map(t=>t.mesh),update,stats:()=>({tiles:tiles.length,vertices:tiles.reduce((sum,t)=>sum+t.mesh.geometry.attributes.position.count,0)})};
}

// Local botanical cover streams in deterministic cells. Density is constrained
// by temperature, water, slope and moisture; hashed jitter only places individuals.
export function createLocalEcology(scene:THREE.Scene,high:boolean,density=1){
 const cell=900,cache=new Map<string,THREE.Group>();
 const trunkGeo=new THREE.CylinderGeometry(.25,.5,10,5),crownGeo=new THREE.ConeGeometry(4.2,16,9,2),broadGeo=new THREE.IcosahedronGeometry(4.8,1),grassGeo=new THREE.ConeGeometry(.55,1.4,3);
 const bark=new THREE.MeshStandardMaterial({color:0x554d3a,roughness:1}),leaf=new THREE.MeshStandardMaterial({color:0x45623e,roughness:1}),grassMat=new THREE.MeshStandardMaterial({color:0x7a8350,roughness:1});
 const dummy=new THREE.Object3D();
 function populate(cx:number,cz:number){const group=new THREE.Group(),trees:Array<[number,number,number,number,boolean]>=[],herbs:typeof trees=[];let seed=(Math.imul(cx+8192,73856093)^Math.imul(cz+8192,19349663))>>>0;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
  for(let i=0;i<Math.round((high?550:300)*density);i++){const x=(cx+random())*cell,z=(cz+random())*cell,p=elaris.sample(x,z);if(p.height<1||p.water||p.coast<.001||p.slope>.75)continue;const scale=.8+random()*1.5;const cluster=.35+.65*(.5+.5*Math.sin(x/270+Math.sin(z/390))*Math.cos(z/310));if(random()<p.treeDensity*cluster)trees.push([x,p.height,z,scale,p.biome==='boreal'||p.temperature<10]);else if(p.slope<.3&&p.temperature>0)herbs.push([x,p.height,z,1+random(),false]);}
  function instances(data:typeof trees,g:THREE.BufferGeometry,m:THREE.Material,offset:number){const inst=new THREE.InstancedMesh(g,m,data.length);data.forEach((p,i)=>{dummy.position.set(p[0],p[1]+offset*p[3],p[2]);dummy.scale.set(p[3]*(.8+random()*.4),p[3],p[3]*(.8+random()*.4));dummy.rotation.set(0,random()*6.28,0);dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);});inst.castShadow=high;inst.receiveShadow=true;inst.computeBoundingSphere();group.add(inst);}
  instances(trees,trunkGeo,bark,5);instances(trees.filter(p=>p[4]),crownGeo,leaf,13);instances(trees.filter(p=>!p[4]),broadGeo,leaf,12);instances(herbs,grassGeo,grassMat,.7);scene.add(group);return group;
 }
 function update(x:number,z:number,altitude:number){const cx=Math.floor(x/cell),cz=Math.floor(z/cell),wanted=new Set<string>();if(altitude<3500)for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)wanted.add(`${cx+dx}:${cz+dz}`);
  for(const [key,group]of cache)if(!wanted.has(key)){scene.remove(group);group.traverse(o=>{if(o instanceof THREE.InstancedMesh)o.dispose()});cache.delete(key);}
  for(const key of wanted)if(!cache.has(key)){const [tx,tz]=key.split(':').map(Number);cache.set(key,populate(tx,tz));break;}
 }
 return {update,dispose(){for(const group of cache.values()){scene.remove(group);group.traverse(o=>{if(o instanceof THREE.InstancedMesh)o.dispose()})}for(const g of [trunkGeo,crownGeo,broadGeo,grassGeo])g.dispose();for(const m of [bark,leaf,grassMat])m.dispose();cache.clear();}};
}
