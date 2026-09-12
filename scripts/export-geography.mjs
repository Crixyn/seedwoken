import {writeFileSync} from 'node:fs';
import {elaris} from '../components/world/geography.mjs';
import {analyzeDrainage} from '../components/world/drainage.mjs';
const start=performance.now(),drainage=analyzeDrainage(elaris,129);
const output={geography:elaris.data,calibration:{version:"2.2",status:"INFERENCE / EXPERIMENTAL",rivers:elaris.rivers,lakes:elaris.lakeShapes.map(lake=>Object.fromEntries(Object.entries(lake).filter(([key])=>key!=='radius')))},drainage:Object.fromEntries(Object.entries(drainage).map(([k,v])=>[k,ArrayBuffer.isView(v)?Array.from(v):v]))};
writeFileSync(new URL('../public/world/elaris-geography.json',import.meta.url),JSON.stringify(output));
console.log(JSON.stringify({gridSize:drainage.size,analysisMs:Math.round(performance.now()-start),status:'EXPERIMENTAL'}));
