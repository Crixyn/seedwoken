import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(path.join(root,'package.json'));
const {build}=require('esbuild');
const output=process.argv[2];if(!output)throw new Error('Pass an absolute HTML output path');
const assets={};
async function walk(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await walk(p);else{const relative='/'+path.relative(path.join(root,'public'),p).split(path.sep).join('/');const ext=path.extname(p);const mime=ext==='.webp'?'image/webp':ext==='.json'?'application/json':'text/plain';assets[relative]={mime,base64:(await fs.readFile(p)).toString('base64')};}}}
await walk(path.join(root,'public/world'));
const bundle=await build({stdin:{contents:'import React from "react";import{createRoot}from"react-dom/client";import World from "./components/world/WorldExplorer";createRoot(document.getElementById("root")).render(React.createElement(World));',resolveDir:root,loader:'tsx'},bundle:true,write:false,format:'iife',platform:'browser',target:'es2020',minify:true,logLevel:'error',define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'standalone-world-assets',setup(b){b.onLoad({filter:/components\/world\/.*\.(tsx|ts|mjs)$/},async args=>{let contents=await fs.readFile(args.path,'utf8');contents=contents.replace('href="/"','href="https://phyvera.crixyn.chatgpt.site"');contents=contents.replace(/(href|src)="(\/world\/[^"]+)"|(['"])(\/world\/[^'"]+)\3/g,(_match,attr,attrUrl,_quote,plainUrl)=>{const url=attr==='href'&&attrUrl==='/world/archive.json'?'/world/archive-download.json':(attrUrl||plainUrl);const expr=`globalThis.__VAELORA_FILES[${JSON.stringify(url)}]`;return attr?`${attr}={${expr}}`:expr;});return {contents,loader:args.path.endsWith('tsx')?'tsx':args.path.endsWith('mjs')?'js':'ts'};});b.onLoad({filter:/\.css$/},()=>({contents:'',loader:'js'}));}}]});
let css='';for(const f of await fs.readdir(path.join(root,'dist/client/assets')))if(f.endsWith('.css'))css+=await fs.readFile(path.join(root,'dist/client/assets',f),'utf8');
// Final authoritative HUD stylesheet avoids stale build CSS overriding the portable view.
css+='\n'+await fs.readFile(path.join(root,'components/world/world.css'),'utf8');
const boot=`const vaeloraRaw=${JSON.stringify(assets)};globalThis.__VAELORA_FILES={};for(const[p,a]of Object.entries(vaeloraRaw)){const bin=atob(a.base64),bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);globalThis.__VAELORA_FILES[p]=URL.createObjectURL(new Blob([bytes],{type:a.mime}));}globalThis.__VAELORA_FILES['/world/archive-download.json']=globalThis.__VAELORA_FILES['/world/archive.json'];const vaeloraArchive=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(vaeloraRaw['/world/archive.json'].base64),c=>c.charCodeAt(0))));for(const r of vaeloraArchive.records){r.image=globalThis.__VAELORA_FILES[r.image]||r.image;r.url=globalThis.__VAELORA_FILES[r.url]||r.url;}globalThis.__VAELORA_FILES['/world/archive.json']=URL.createObjectURL(new Blob([JSON.stringify(vaeloraArchive)],{type:'application/json'}));`;
const js=bundle.outputFiles.find(f=>f.path.endsWith('.js'))?.text||bundle.outputFiles[0].text;
// Escape closing script tokens in data/source so none can terminate the HTML script element.
const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vaelora — Seedwoken 3D World Trial</title><style>'+css+'</style></head><body><div id="root"></div><script>'+ (boot+js).replace(/<\/script/gi,'<\\/script')+'</script></body></html>';
await fs.writeFile(output,html);console.log(JSON.stringify({output,bytes:Buffer.byteLength(html),embeddedAssets:Object.keys(assets).length,networkRequired:false}));
