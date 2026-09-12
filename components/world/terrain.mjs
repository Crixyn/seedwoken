// Engine-independent, deterministic scene interpretation; coordinates are NOT canonical distances.
export const EXTENT=900;
export const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
function hash(x,z,s=0){const n=Math.sin(x*127.1+z*311.7+s*74.7)*43758.5453;return n-Math.floor(n)}
export function noise(x,z,s=0){const a=Math.floor(x),b=Math.floor(z),u=smooth(x-a),v=smooth(z-b);return mix(mix(hash(a,b,s),hash(a+1,b,s),u),mix(hash(a,b+1,s),hash(a+1,b+1,s),u),v)}
function fbm(x,z,s=0){return noise(x,z,s)*.53+noise(x*2.1,z*2.1,s+1)*.27+noise(x*4.3,z*4.3,s+2)*.13+noise(x*8.5,z*8.5,s+3)*.07}
const gauss=(x,z,cx,cz,sx,sz)=>Math.exp(-((x-cx)**2/sx**2+(z-cz)**2/sz**2));
// Hand-interpreted silhouettes guided by Codex v1.5 embedded geographic plates.
const shapes={
 elaris:[[-.45,-.83],[-.06,-.94],[.29,-.84],[.54,-.75],[.51,-.51],[.68,-.32],[.59,-.07],[.71,.08],[.61,.33],[.78,.58],[.48,.63],[.37,.82],[.16,.71],[.04,.90],[-.09,.77],[-.35,.83],[-.39,.66],[-.57,.57],[-.41,.39],[-.68,.36],[-.56,.16],[-.72,.02],[-.51,-.17],[-.61,-.36],[-.44,-.52],[-.57,-.68]],
 sahrel:[[-.44,-.84],[-.08,-.91],[.25,-.83],[.52,-.68],[.62,-.45],[.54,-.22],[.70,.00],[.61,.24],[.72,.46],[.54,.65],[.33,.58],[.24,.86],[.04,.66],[-.14,.80],[-.35,.59],[-.65,.64],[-.56,.38],[-.71,.16],[-.63,-.08],[-.73,-.37],[-.52,-.56]],
 caelune:[[-.45,-.89],[-.14,-.95],[.14,-.88],[.37,-.94],[.44,-.72],[.60,-.62],[.55,-.40],[.68,-.14],[.60,.07],[.69,.31],[.53,.54],[.64,.66],[.32,.68],[.14,.90],[-.06,.79],[-.28,.87],[-.33,.66],[-.59,.68],[-.45,.48],[-.69,.41],[-.53,.23],[-.72,.09],[-.60,-.11],[-.75,-.32],[-.55,-.48],[-.68,-.65]],
 vulkara:[[-.32,-.90],[.03,-.77],[.38,-.64],[.28,-.34],[.61,-.12],[.43,.18],[.66,.50],[.46,.74],[.17,.62],[-.06,.87],[-.35,.61],[-.62,.43],[-.52,.09],[-.69,-.17],[-.42,-.39],[-.50,-.68]],
 nythrune:[[-.49,-.80],[-.18,-.91],[.19,-.84],[.50,-.65],[.66,-.30],[.58,.02],[.71,.34],[.49,.64],[.11,.81],[-.22,.72],[-.49,.79],[-.66,.43],[-.59,.10],[-.73,-.16],[-.61,-.49]]
};
function polygonDistance(x,z,points){let inside=false,d=100;for(let i=0,j=points.length-1;i<points.length;j=i++){
 const [ax,az]=points[i],[bx,bz]=points[j];if(((az>z)!==(bz>z))&&(x<(bx-ax)*(z-az)/(bz-az)+ax))inside=!inside;
 const dx=bx-ax,dz=bz-az,t=clamp(((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz));d=Math.min(d,Math.hypot(x-ax-t*dx,z-az-t*dz));
}return inside?d:-d}
export function coast(id,x,z){
 if(id==='thyrra'){let d=-10;for(const [cx,cz,sx,sz] of [[0,-.52,.27,.36],[-.37,.02,.24,.31],[.28,.04,.23,.34],[.05,.48,.20,.23],[.51,.60,.12,.17],[-.51,.57,.11,.16],[-.39,-.61,.12,.15],[.56,-.48,.12,.20]])d=Math.max(d,(1-Math.hypot((x-cx)/sx,(z-cz)/sz))*.22);return d+(noise(x*25,z*25,17)-.5)*.018;}
 let d=polygonDistance(x,z,shapes[id]||shapes.elaris);
 const islands=[[-.76,.47,.074],[-.81,.18,.052],[-.69,.73,.060],[-.40,.92,.052],[.10,.98,.055],[.42,.88,.061],[.76,.78,.056],[-.82,-.54,.046]];
 for(const [cx,cz,r] of islands)d=Math.max(d,r-Math.hypot(x-cx,z-cz));
 return d+(noise(x*36,z*36,10)-.5)*.011;
}
const main=[[.09,-.63],[.05,-.48],[.15,-.31],[.09,-.15],[.18,.01],[.10,.16],[.16,.32],[.08,.48],[.17,.63],[.14,.85]];
export function riverPaths(id){
 if(id==='elaris')return [main,[[-.36,-.49],[-.25,-.28],[-.18,-.12],[.09,-.15]],[[.42,-.46],[.34,-.25],[.18,.01]],[[-.41,.10],[-.24,.21],[.16,.32]],[[.45,.35],[.32,.44],[.08,.48]],[[-.17,.46],[-.04,.57],[.17,.63]],[[.17,.63],[-.02,.74],[-.10,.88]],[[.17,.63],[.31,.73],[.38,.83]]];
 if(id==='caelune')return [[[.08,-.27],[.10,-.04],[.01,.13],[.15,.33],[.07,.54],[.14,.88]],[[-.29,-.34],[-.40,-.16],[-.54,.02],[-.72,.09]],[[.38,-.24],[.27,.01],[.15,.33]]];
 if(id==='sahrel')return [[[.12,-.64],[.08,-.48],[.14,-.36]],[[.02,.34],[.10,.51],[.02,.63],[.04,.81]]];
 if(id==='nythrune')return [[[-.12,-.55],[.05,-.30],[.12,-.08],[.04,.11],[.20,.32],[.18,.50],[.11,.81]],[[.20,.32],[.39,.48],[.49,.65]]];
 return [];
}
export function riverLevel(id,z){return id==='caelune'?Math.max(.3,150*(.87-z)):id==='sahrel'?Math.max(.3,45*(.80-z)):id==='nythrune'?Math.max(.3,28*(.82-z)):Math.max(.3,65*(.86-z));}
export function riverSurface(id,x,z){return riverLevel(id,z)*smooth(clamp(coast(id,x,z)/.06));}
export function riverInfo(id,x,z){let d=10;for(const p of riverPaths(id))for(let i=1;i<p.length;i++){const [ax,az]=p[i-1],[bx,bz]=p[i],dx=bx-ax,dz=bz-az,t=clamp(((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz));d=Math.min(d,Math.hypot(x-ax-dx*t,z-az-dz*t));}return {distance:d,level:riverSurface(id,x,z)};}
export function lakes(id){return id==='elaris'?[[.09,-.60,.075,.065],[-.18,-.62,.053,.04]]:id==='caelune'?[[.08,-.27,.075,.045],[-.29,-.34,.047,.05]]:id==='sahrel'?[[.12,-.64,.10,.062]]:[];}
export function sample(id,wx,wz){const x=wx/EXTENT,z=wz/EXTENT,d=coast(id,x,z),n=fbm(x*5+30,z*5+30,3),detail=fbm(x*33,z*33,11),ridge=1-Math.abs(noise(x*8+20,z*8+20,5)*2-1);let h=0,biome='forest';
 if(id==='elaris'){h=16+n*40+ridge*15+gauss(x,z,-.04,-.72,.60,.24)*(140+n*100)+gauss(x,z,-.35,-.04,.22,.5)*34;biome=z>.43?'wetland':z<-.50?'highland':n>.51?'forest':'meadow';}
 if(id==='sahrel'){const basin=gauss(x,z,.02,-.08,.41,.45);h=40+n*110+ridge*55-basin*90;h=Math.max(12,h);if(z>.24)h+=Math.sin(x*78+z*25)*Math.sin(z*10)*10;biome=basin>.6?'salt':z>.25?'dune':'desert';}
 if(id==='caelune'){const axis=x+.14*Math.sin(z*4);h=35+n*55+gauss(axis,z,0,-.20,.24,.83)*(180+ridge*180);for(const [px,pz]of[[-.13,-.46],[.03,-.56],[.16,-.43],[.03,-.34]])h+=gauss(x,z,px,pz,.066,.074)*205;h-=gauss(x,z,.02,-.45,.075,.065)*115;biome=h>240?'snow':x>.22?'steppe':x<-.18?'forest':'alpine';}
 if(id==='vulkara'){h=20+n*60;for(const [cx,cz,r]of[[-.12,-.40,.22],[.18,-.05,.18],[.30,.42,.16]]){const k=Math.hypot(x-cx,z-cz)/r;h+=Math.max(0,1-k)*310;if(k<.24)h-=Math.pow(1-k/.24,1)*150;}biome=h>110?'volcanic':n>.52?'forest':'ash';}
 if(id==='thyrra'){h=8+n*60+ridge*35;biome=d<.045?'wetland':h>75?'highland':'tropical';}
 if(id==='nythrune'){h=13+n*45+gauss(x,z,-.3,-.46,.32,.34)*100;biome=z>.3?'wetland':'jungle';}
 if(['elaris','caelune','nythrune'].includes(id))h=Math.max(h,riverLevel(id,z)+8+n*20);
 h+=detail*6;h*=smooth(clamp(d/.11));if(d<0)h=-5-Math.min(35,-d*170);
 const river=riverInfo(id,x,z);let water=0;const width=id==='elaris'?(z>.55?.022:.013):id==='caelune'?.009:.011;
 if(d>.01&&river.distance<width*2.5){const influence=smooth(clamp((width*2.5-river.distance)/(width*1.5)));h=mix(h,river.level-3,influence);if(river.distance<width)water=river.level;}
 for(const [cx,cz,sx,sz]of lakes(id)){const r=Math.hypot((x-cx)/sx,(z-cz)/sz);if(r<1.25){const level=riverLevel(id,cz);h=mix(h,level-8,smooth(clamp((1.25-r)/.25)));if(r<1)water=level;}}
 if(id==='sahrel'&&biome==='salt')h= mix(h,17,smooth(gauss(x,z,.02,-.08,.34,.36)));
 return {height:h,biome,water,coast:d,moisture:n,river:river.distance};
}
export function terrainColor(id,p){const colors={forest:[.19,.30,.19],meadow:[.33,.40,.19],wetland:[.23,.34,.25],highland:[.35,.38,.32],salt:[.69,.63,.48],dune:[.60,.39,.20],desert:[.48,.32,.20],snow:[.77,.85,.86],steppe:[.42,.37,.27],alpine:[.36,.41,.39],volcanic:[.19,.17,.16],ash:[.28,.27,.22],tropical:[.16,.34,.22],jungle:[.13,.25,.18]};let c=colors[p.biome]||colors.forest;const variation=.79+p.moisture*.35;
 if(p.height<0)c=[.14,.27,.27];else if(p.coast<.025)c=id==='vulkara'?[.22,.23,.22]:[.57,.53,.37];
 return c.map(v=>v*variation);
}
