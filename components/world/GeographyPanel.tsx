'use client';
import {useEffect,useRef,useState} from 'react';
import {Slider} from '../ui/slider';
import {elaris,geographyColor} from './geography.mjs';
import {analyzeDrainage} from './drainage.mjs';
import {classifications} from './elaris-geography.mjs';
const mapCache=new Map<string,ImageData>();
type Props={position:{x:number;z:number}|null;onTravel:(x:number,z:number)=>void;onSource:(id:string)=>void};
export default function GeographyPanel({position,onTravel,onSource}:Props){
 const canvas=useRef<HTMLCanvasElement>(null),[layer,setLayer]=useState('terrain'),[opacity,setOpacity]=useState(.35),[zoom,setZoom]=useState(1),[point,setPoint]=useState({x:.055,z:-.14}),[status,setStatus]=useState('all'),[compare,setCompare]=useState(false);
 const p=elaris.sample(point.x*elaris.extent,point.z*elaris.extent),data=elaris.data;
 const cx=zoom===1?0:Math.max(-1+1/zoom,Math.min(1-1/zoom,(position?.x||0))),cz=zoom===1?0:Math.max(-1+1/zoom,Math.min(1-1/zoom,(position?.z||0)));
 useEffect(()=>{const c=canvas.current;if(!c)return;const ctx=c.getContext('2d');if(!ctx)return;const n=160;let image=mapCache.get(layer);if(!image){image=ctx.createImageData(n,n);const drainage=layer==='watersheds'?analyzeDrainage(elaris,n):null;for(let z=0;z<n;z++)for(let x=0;x<n;x++){const s=elaris.sample((x/(n-1)*2-1)*elaris.extent,(z/(n-1)*2-1)*elaris.extent);let color=geographyColor(s);if(layer==='elevation'&&s.height>=0){const t=Math.min(1,s.height/3200);color=[.17+t*.7,.30+t*.55,.22+t*.67];}if(layer==='moisture'&&s.height>=0)color=[.5-s.moisture*.35,.28+s.moisture*.3,.14+s.moisture*.5];if(drainage&&s.height>=0){const catchment=drainage.catchment[z*n+x];color=catchment<0?[.36,.38,.32]:[[.3,.54,.4],[.57,.47,.27],[.37,.48,.64],[.62,.37,.35],[.46,.37,.62],[.28,.6,.64],[.64,.6,.35]][catchment%7];}if(s.water)color=[.18,.48,.58];const i=(z*n+x)*4;image.data.set([...color.map(v=>Math.round(v*255)),255],i);}mapCache.set(layer,image);}ctx.putImageData(image,0,0);},[layer]);
 const project=(x:number,z:number)=>({left:`${((x-cx)*zoom+1)*50}%`,top:`${((z-cz)*zoom+1)*50}%`});
 const view=[(cx+1-1/zoom)*500,(cz+1-1/zoom)*500,1000/zoom,1000/zoom].join(' ');
 const links=data.spatialLinks.filter(l=>status==='all'||l.status===status);
 return <section className="geography-panel">
  <span className="world-badge">MILESTONE 2.2 · ELARIS</span><h2>Geographic reconstruction</h2>
  <p>Compare the reconstructed coast, mountain divides and drainage with Geographic Reference 001. Select a point to inspect its environment.</p>
  <div className="world-options">{['terrain','elevation','moisture','watersheds'].map(l=><button key={l} className={layer===l?'active':''} onClick={()=>setLayer(l)}>{l}</button>)}</div>
  <div className={compare?"geography-comparison":""}>{compare&&<figure><img src={data.registration.reference} alt="Canonical Elaris reference for side-by-side comparison"/><figcaption>Canonical Reference 001</figcaption></figure>}<div className="geography-map" role="group" aria-label="Elaris regional map">
   <div className="geography-map-raster" style={{width:`${zoom*100}%`,height:`${zoom*100}%`,left:`${-((cx+1)*zoom-1)*50}%`,top:`${-((cz+1)*zoom-1)*50}%`}}><canvas ref={canvas} width={160} height={160}/><img src={data.registration.reference} style={{opacity:compare?0:opacity}} alt="Accepted Elaris Geographic Reference 001 overlay"/></div>
   <svg viewBox={view} preserveAspectRatio="none" aria-label="Digitized coastline, mountain divides and watercourses" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setPoint({x:cx+((e.clientX-r.left)/r.width*2-1)/zoom,z:cz+((e.clientY-r.top)/r.height*2-1)/zoom})}}>
    {[data.boundary,...data.islands].map(b=><polygon key={b.id} points={b.points.map(([x,z])=>`${(x+1)*500},${(z+1)*500}`).join(' ')} fill="none" stroke="#e0dca2" strokeWidth={1.7/zoom}/>)}
    {data.mountains.map(r=><polyline key={r.id} points={r.points.map(([x,z]:number[])=>`${(x+1)*500},${(z+1)*500}`).join(' ')} fill="none" stroke="#e3b28a" strokeDasharray={`${4/zoom} ${4/zoom}`} strokeWidth={2/zoom}/>)}
    {data.hydrology.rivers.map(r=><polyline key={'trace-'+r.id} points={r.points.map(([x,z]:number[])=>`${(x+1)*500},${(z+1)*500}`).join(' ')} fill="none" stroke="#d4b294" strokeDasharray={`${4/zoom} ${3/zoom}`} strokeWidth={1/zoom}/>)}
    {elaris.rivers.map(r=><polyline key={r.id} points={r.points.map(([x,z]:number[])=>`${(x+1)*500},${(z+1)*500}`).join(' ')} fill="none" stroke="#91e6f0" strokeWidth={2/zoom}/>)}
    {elaris.lakeShapes.map(l=><polygon key={l.id} points={l.points.map(([x,z]:number[])=>`${(x+1)*500},${(z+1)*500}`).join(' ')} fill="#519fb033" stroke="#99e6df" strokeWidth={2/zoom}/>)}
    {data.landmarks.map(l=><circle key={l.name} cx={(l.x+1)*500} cy={(l.z+1)*500} r={3/zoom} fill="#fff1b0"><title>{l.name}</title></circle>)}
   </svg>
   {position&&<span className="geography-position" style={project(position.x,position.z)} title="Current position">▲</span>}<span className="geography-selection" style={project(point.x,point.z)}>+</span><span className="geography-north">N ↑</span>
  </div>
  </div><button className="world-primary" onClick={()=>{setCompare(v=>!v);setZoom(1)}}>{compare?'Return to overlay comparison':'Compare reference beside reconstruction'}</button>
  <p className="world-small">Gold: traced coast · dashed: inferred divides · blue: calibrated drainage and lake outlines · thin dashed lines: original river controls · triangle: your position. Overlay registration follows an oblique illustration, not a surveyed projection.</p>
  <label className="geo-slider">Accepted reference overlay <Slider min={0} max={1} step={.05} value={[opacity]} onValueChange={v=>setOpacity(v[0])} aria-label="Reference overlay opacity"/></label>
  <div className="world-options">{[1,2,4].map(z=><button key={z} className={zoom===z?'active':''} onClick={()=>setZoom(z)}>{z===1?'Continent':`${z}× regional`}</button>)}</div>
  <details className="world-coverage"><summary>Reference calibration and channel dimensions</summary><p>The coast, mountain axes, lake centres, outlet controls and landmarks are unchanged. Curves and shore contours are INFERENCE. Correspondence to the oblique reference still requires visual review.</p><table className="geo-channel-table"><thead><tr><th>Channel</th><th>Width range</th></tr></thead><tbody>{elaris.rivers.map(r=><tr key={r.id}><td>{r.name}</td><td>{Math.round(Math.min(...r.stations.map(s=>s.width))*120000)}–{Math.round(Math.max(...r.stations.map(s=>s.width))*120000)} m</td></tr>)}</tbody></table><p>Widths and flow proxies are experimental model quantities. Broad valleys, floodplains and channel profiles are derived from gradient and confinement; this is not a time-stepped erosion simulation.</p></details>
  <h3>{p.region}</h3><span className="world-badge">ENVIRONMENT: EXPERIMENTAL</span>
  <dl className="geography-readings"><dt>Reference coordinates</dt><dd>{point.x.toFixed(3)}, {point.z.toFixed(3)}</dd><dt>Model elevation</dt><dd>{Math.round(p.height)} m</dd><dt>Environment</dt><dd>{p.biome}</dd><dt>Temperature proxy</dt><dd>{p.temperature.toFixed(1)} °C</dd><dt>Rainfall proxy</dt><dd>{Math.round(p.rainfall)} mm/year</dd><dt>Rain-shadow index</dt><dd>{p.rainShadow.toFixed(2)}</dd><dt>Terrain slope</dt><dd>{Math.round(Math.atan(p.slope)*180/Math.PI)}°</dd><dt>Drainage / soil indices</dt><dd>{p.drainage.toFixed(2)} / {p.soil.toFixed(2)}</dd><dt>Nearest channel</dt><dd>{data.hydrology.rivers.find(r=>r.id===p.channel)?.name||'Unknown'}</dd></dl>
  <button className="world-primary" onClick={()=>onTravel(point.x,point.z)}>Travel to selected point</button>
  {layer==='watersheds'&&<p className="world-small">Experimental D8 catchments computed from terrain with depression filling. Colors group cells draining toward the same traced channel; grey drains directly to coast. This is a drainage diagnostic, not simulated flooding.</p>}<a className="world-primary" href="/world/elaris-geography.json" download="Elaris-Geography-M2.2.json">Download structured geography & drainage</a><h3>Evaluation locations</h3><div className="world-destinations">{data.landmarks.map(l=><button key={l.name} onClick={()=>onTravel(l.x,l.z)}>{l.name}</button>)}</div>
  <div className="world-open"><strong>Scale and unresolved geography</strong><p>{data.metrics.note}</p><p>{data.climate.note}</p><p>The Silren, Mossrun, Avenwater, Briarwash and Orin’s Fork are established names. Their exact channels remain unassigned.</p></div>
  <h3>Spatial source links</h3><label>Classification <select value={status} onChange={e=>setStatus(e.target.value)} aria-label="Spatial link classification"><option value="all">All classifications</option>{classifications.map(c=><option key={c}>{c}</option>)}</select></label>
  {links.map(l=><article className="geography-link" key={l.entityId}><span className="world-badge">{l.status}</span><strong>{l.entityId}</strong><p>{l.relation} · {l.continent||'Continent unknown'} · {l.region||'Region unknown'}</p><button onClick={()=>onSource(l.sourceIds[0])}>Read supporting source</button></article>)}{!links.length&&<p>No spatial records have this classification. Existing archive classifications remain intact.</p>}
 </section>;
}
