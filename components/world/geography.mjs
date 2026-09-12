// Renderer-independent reconstruction compiler. It accepts structured continental
// inputs; only the registry below knows which continent is currently reconstructed.
import {compileRivers,compileLakes,riverIndex,nearestReach,reachesAt,emptyReach,channelProfile} from './hydromorphology.mjs';
import {elarisGeography} from './elaris-geography.mjs';
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
const mix=(a,b,t)=>a+(b-a)*t;
const hash=(x,z,s)=>{const v=Math.sin(x*127.1+z*311.7+s)*43758.5453;return v-Math.floor(v)};
function noise(x,z,s){const a=Math.floor(x),b=Math.floor(z),u=smooth(x-a),v=smooth(z-b);return mix(mix(hash(a,b,s),hash(a+1,b,s),u),mix(hash(a,b+1,s),hash(a+1,b+1,s),u),v)}
export function segmentDistance(x,z,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],t=clamp(((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1));return {distance:Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t),z:a[1]+dz*t,t};}
export function polygonDistance(x,z,points){let inside=false,d=Infinity;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;d=Math.min(d,segmentDistance(x,z,a,b).distance);}return inside?d:-d;}
const pathDistance=(x,z,points)=>{let nearest={distance:Infinity,z};for(let i=1;i<points.length;i++){const p=segmentDistance(x,z,points[i-1],points[i]);if(p.distance<nearest.distance)nearest=p;}return nearest;};
export function validateGeography(data){
 if(data.schemaVersion!==1||!(data.extent>0)||data.boundary.points.length<3)throw new Error('Invalid geography schema');
 const ids=new Set(data.hydrology.rivers.map(r=>r.id));
 for(const r of data.hydrology.rivers){if(r.outlet&&!ids.has(r.outlet))throw new Error('Missing downstream river '+r.outlet);for(let i=1;i<r.points.length;i++)if(r.points[i][1]<r.points[i-1][1])throw new Error('Uphill drainage order '+r.id);}
 for(const link of data.spatialLinks)if(link.status==='UNKNOWN'&&(link.continent||link.region))throw new Error('Unknown range was assigned a location');
 return true;
}
/** @param {import('./geography-types').GeographyData} data */
export function createGeography(data){
 validateGeography(data);
 const extent=data.extent,polygons=[data.boundary,...data.islands].map(p=>({...p,minX:Math.min(...p.points.map(p=>p[0])),maxX:Math.max(...p.points.map(p=>p[0])),minZ:Math.min(...p.points.map(p=>p[1])),maxZ:Math.max(...p.points.map(p=>p[1]))}));
 const coast=(x,z)=>{let d=-4;for(const p of polygons){const bound=Math.max(p.minX-x,x-p.maxX,p.minZ-z,z-p.maxZ,0);if(bound>Math.max(.03,-d))continue;d=Math.max(d,polygonDistance(x,z,p.points));}return d;};
 // Shared monotonic longitudinal datum makes confluences meet exactly. Flat lake
 // surfaces take their level from their outlet; no uphill coastal fade is used.
 const level=z=>Math.pow(clamp((.62-z)/1.62),1.8)*1150;
 function rawHeight(x,z,d){
  if(d<0)return -Math.min(450,8-d*9000);
  let h=65+noise(x*7,z*7,data.seed)*170+(1-z)*50;
  for(const m of data.mountains){const p=pathDistance(x,z,m.points),envelope=Math.exp(-((p.distance/m.width)**2));let alongSum=0,crossSum=0,weightSum=0;for(let i=1;i<m.points.length;i++){const a=m.points[i-1],b=m.points[i],q=segmentDistance(x,z,a,b),len=Math.hypot(b[0]-a[0],b[1]-a[1]),weight=Math.exp(-((q.distance/(m.width*.6))**2));alongSum+=(i-1+q.t)*weight;crossSum+=((x-a[0])*(b[1]-a[1])-(z-a[1])*(b[0]-a[0]))/len*weight;weightSum+=weight;}const along=alongSum/(weightSum||1),cross=crossSum/(weightSum||1);const massif=.78+.22*Math.cos(along*4.3);const spurPhase=along*19+Math.abs(cross)/m.width*3.4;const spurs=Math.pow(.5+.5*Math.cos(spurPhase),3)*Math.exp(-Math.abs(cross)/m.width*1.4);const gullies=Math.pow(.5+.5*Math.sin(spurPhase+Math.abs(cross)/m.width*2),6)*smooth(Math.abs(cross)/m.width)*.16;const secondary=.065*Math.cos(along*53+cross/m.width*11)*Math.exp(-Math.abs(cross)/m.width);const ribs=Math.pow(.5+.5*Math.cos(along*91+Math.abs(cross)/m.width*27+Math.sin(along*17)),4)*.045*Math.exp(-Math.abs(cross)/m.width);h+=m.height*envelope*(ribs+massif*(1.05+spurs*.24)-gullies+secondary);}
  for(const p of data.plateaus){const q=((x-p.x)/p.rx)**2+((z-p.z)/p.rz)**2;h+=p.height*smooth(1-q);}
  h+=noise(x*110,z*110,data.seed+4)*28+noise(x*400,z*400,data.seed+3)*6;
  return h*smooth(d/.018);
 }
 const uplift=(x,z)=>rawHeight(x,z,coast(x,z));
 const rivers=compileRivers(data,level,uplift),lakeShapes=compileLakes(data,level,uplift),segmentsAt=riverIndex(rivers);
 const waterAt=(x,z)=>nearestReach(x,z,segmentsAt(x,z));
 function surface(x,z){const d=coast(x,z),segments=segmentsAt(x,z),byRiver=reachesAt(x,z,segments),water=byRiver.reduce((a,b)=>a.distance<b.distance?a:b,emptyReach());let h=rawHeight(x,z,d),wet=0;
  if(d>=0){
   // Smooth union of adjacent channel profiles avoids Voronoi walls at confluences.
   for(const w of byRiver){if(w.distance>w.valleyWidth)continue;const profile=w.level+channelProfile(w.distance,w.width,w.depth,w.valleyWidth);const weight=smooth(1-w.distance/w.valleyWidth);h=Math.min(h,h*(1-weight)+profile*weight);if(w.distance<w.width){h=Math.min(h,profile);wet=Math.max(wet,w.level);}}
   for(const l of lakeShapes){const dx=(x-l.x)/l.rx,dz=(z-l.z)/l.rz,a=Math.atan2(dz,dx),r=Math.hypot(dx,dz)/l.radius(a);if(r<1.35){const bed=l.level-25*(1-Math.min(1,r*r))+10*smooth((r-1)/.35);h=h*(1-smooth((1.35-r)/.35))+bed*smooth((1.35-r)/.35);if(r<1){h=Math.min(h,l.level-.3);wet=l.level;}}}
   for(const w of byRiver)if(w.distance<w.width){h=Math.min(h,w.level+channelProfile(w.distance,w.width,w.depth,w.valleyWidth));wet=Math.max(wet,w.level);}
  }
  return {height:h,water:wet,coast:d,river:water.distance,channel:water.id};
 }
 function sample(wx,wz){const x=wx/extent,z=wz/extent,p=surface(x,z),delta=30/extent;
  const gradientX=(surface(x+delta,z).height-surface(x-delta,z).height)/60,gradientZ=(surface(x,z+delta).height-surface(x,z-delta).height)/60,slope=Math.hypot(gradientX,gradientZ);
  const temperature=mix(data.climate.northTemperature,data.climate.southTemperature,clamp((z+1)/2))-Math.max(0,p.height)*data.climate.lapseRate;
  let barrier=0;for(const m of data.mountains){for(const point of m.points){if(point[0]<x)barrier=Math.max(barrier,m.height*Math.exp(-(((z-point[1])/.1)**2))*Math.exp(-(x-point[0])/.3));}}
  const rainShadow=clamp(barrier/2200),rainfall=data.climate.rainfall*(1-.68*rainShadow)*(1+.25*clamp(p.height/1800));
  const moisture=clamp(.25+rainfall/2200+.20*Math.exp(-p.river/.025)-slope*.3),drainage=clamp(slope*2+p.height/4000),soil=clamp(moisture*.7+(1-drainage)*.3);
  const deltaWet=smooth((z-.10)/.24)*Math.exp(-(((x-.20)/.28)**4))*smooth(1-p.river/.045)>.3;
  let biome=p.height<0?'ocean':temperature<0?'snow':p.height>1800||slope>.8?'alpine':deltaWet&&slope<.12?'wetland':p.coast<.009?'coast':temperature<7?'boreal':moisture<.52?'grassland':p.river<.015?'riparian':'forest';
  const treeDensity=['snow','alpine','ocean','coast'].includes(biome)?0:clamp((moisture-.38)*1.5)*(1-clamp(slope/.65))*(biome==='wetland'?.25:1);
  const region=data.regions.find(r=>x>=r.bounds[0]&&z>=r.bounds[1]&&x<=r.bounds[2]&&z<=r.bounds[3]);
  const snowCover=clamp((-temperature+2)/8)*clamp((1-slope/.95))*clamp(.5+moisture*.5);
  return {...p,snowCover,biome,moisture,slope,gradientX,gradientZ,temperature,rainfall,rainShadow,drainage,soil,treeDensity,region:region?.name||'Offshore waters',regionId:region?.id||'ocean',environmentStatus:'EXPERIMENTAL'};
 }
 return {data,extent,coast,level,waterAt,surface,sample,rivers,lakeShapes,uplift};
}
export const elaris=createGeography(elarisGeography);
export const geographyFor=id=>id==='elaris'?elaris:null;
export const extentFor=id=>geographyFor(id)?.extent||900;
export const environmentColors={ocean:[.10,.25,.28],snow:[.79,.86,.88],alpine:[.38,.40,.36],boreal:[.18,.29,.25],wetland:[.29,.38,.24],coast:[.57,.54,.39],grassland:[.43,.46,.26],riparian:[.21,.36,.23],forest:[.22,.33,.21]};
/** @returns {number[]} */
export function geographyColor(p){const base=environmentColors[p.biome==='snow'?'alpine':p.biome]||environmentColors.forest,snow=p.snowCover||0;const wet=p.water>0||p.river<.004;return base.map((v,i)=>mix(v*(wet?.70:.85+p.moisture*.25),environmentColors.snow[i],snow));}
