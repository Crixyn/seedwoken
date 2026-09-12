// Reference-constrained morphometry, not a historical erosion or fluid simulation.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
// Shape-preserving cubic x(z) retains every reference control and monotone z.
export function smoothCourse(points,spacing=.0025){
 const slopes=points.slice(1).map((p,i)=>(p[0]-points[i][0])/(p[1]-points[i][1]||1e-9));
 const tangents=points.map((_,i)=>i===0?slopes[0]:i===points.length-1?slopes.at(-1):slopes[i-1]*slopes[i]<=0?0:2/(1/slopes[i-1]+1/slopes[i]));
 const result=[];for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],dz=b[1]-a[1],steps=Math.max(3,Math.ceil(Math.hypot(b[0]-a[0],dz)/spacing));for(let j=0;j<steps;j++){const t=j/steps,t2=t*t,t3=t2*t;result.push([(2*t3-3*t2+1)*a[0]+(t3-2*t2+t)*dz*tangents[i]+(-2*t3+3*t2)*b[0]+(t3-t2)*dz*tangents[i+1],a[1]+dz*t]);}}result.push([...points.at(-1)]);return result;
}
/** @param {import('./geography-types').GeographyData} data */
export function compileRivers(data,level,uplift){
 return data.hydrology.rivers.map(r=>{const points=smoothCourse(r.points),lengths=[0];for(let i=1;i<points.length;i++)lengths.push(lengths[i-1]+Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]));const total=lengths.at(-1);
 const stations=points.map(([x,z],i)=>{const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],length=Math.hypot(b[0]-a[0],b[1]-a[1]),tx=(b[0]-a[0])/length,tz=(b[1]-a[1])/length,progress=lengths[i]/total;
 const grade=Math.max(.00005,Math.abs(level(b[1])-level(a[1]))/(length*data.extent)),confinement=clamp((uplift(x,z)-level(z))/1200);
 const tributary=r.outlet!==null,delta=r.id.startsWith('delta'),flow=(tributary?.12:delta?.52:.6)+progress*(tributary?.45:delta?.35:1.4)+data.hydrology.rivers.filter(t=>t.outlet===r.id).reduce((sum,t)=>sum+.2*smooth((z-t.points.at(-1)[1]+.008)/.016),0);
 const width=clamp(.0032*Math.sqrt(flow)*(1-.45*confinement)/(1+grade*35),tributary?.00065:.0018,tributary?.0022:.006);
 const depth=clamp(3+Math.sqrt(flow)*5+grade*140,3,16),valleyWidth=width*(5+10*(1-confinement));
 return {x,z,tx,tz,level:level(z),width,depth,valleyWidth,grade,flow,confinement};});
 return {...r,points,stations};});
}
// Natural shore response within the reference lake envelope. The outlet is pinned.
/** @param {import('./geography-types').GeographyData} data */
export function compileLakes(data,level,uplift){return data.hydrology.lakes.map(l=>{const outlet=data.hydrology.rivers.find(r=>r.id===l.outlet).points[0],outletAngle=Math.atan2((outlet[1]-l.z)/l.rz,(outlet[0]-l.x)/l.rx),waterLevel=level(l.outletZ);
 const radii=Array.from({length:128},(_,i)=>{const a=i/128*Math.PI*2,x=l.x+Math.cos(a)*l.rx,z=l.z+Math.sin(a)*l.rz;const structure=clamp((waterLevel-uplift(x,z))/1500,-.3,.22);return 1+structure+.08*Math.sin(a*3+l.x*13)+.045*Math.sin(a*5+l.z*9);});
 const radius=a=>{const t=((a/(Math.PI*2)%1)+1)%1*128,k=Math.floor(t),f=t-k;const v=radii[k]*(1-f)+radii[(k+1)%128]*f;const anchor=Math.pow((1+Math.cos(a-outletAngle))/2,16);return v*(1-anchor)+anchor;};
 const points=Array.from({length:128},(_,i)=>{const a=i/128*Math.PI*2,r=radius(a);return [l.x+Math.cos(a)*l.rx*r,l.z+Math.sin(a)*l.rz*r]});
 return {...l,level:waterLevel,points,radius};});}
export function riverIndex(rivers){const buckets=new Map(),cell=.08;for(const r of rivers)for(let i=1;i<r.stations.length;i++){const a=r.stations[i-1],b=r.stations[i],pad=Math.max(a.valleyWidth,b.valleyWidth)+.01;for(let z=Math.floor((Math.min(a.z,b.z)-pad)/cell);z<=Math.floor((Math.max(a.z,b.z)+pad)/cell);z++)for(let x=Math.floor((Math.min(a.x,b.x)-pad)/cell);x<=Math.floor((Math.max(a.x,b.x)+pad)/cell);x++){const key=x+':'+z;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push({a,b,id:r.id});}}
 return (x,z)=>buckets.get(Math.floor(x/cell)+':'+Math.floor(z/cell))||[];
}
export function reachesAt(x,z,segments){const groups=new Map();for(const {a,b,id}of segments){const dx=b.x-a.x,dz=b.z-a.z,t=clamp(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz)),distance=Math.hypot(x-a.x-t*dx,z-a.z-t*dz),old=groups.get(id);if(!old||distance<old.distance){const value=k=>a[k]*(1-t)+b[k]*t;groups.set(id,{distance,level:value('level'),width:value('width'),depth:value('depth'),valleyWidth:value('valleyWidth'),grade:value('grade'),id,wet:distance<value('width')});}}return [...groups.values()];}
export const emptyReach=()=>({distance:10,level:0,width:0,depth:0,valleyWidth:0,grade:0,id:'',wet:false});
export const nearestReach=(x,z,segments)=>reachesAt(x,z,segments).reduce((a,b)=>a.distance<b.distance?a:b,emptyReach());
export function channelProfile(distance,width,depth,valleyWidth){if(distance<=width)return -depth*(1-(distance/width)**2);const bank=(distance-width)/Math.max(width*2,.001);return 3*smooth(bank)+22*smooth((distance-width)/(valleyWidth-width));}
