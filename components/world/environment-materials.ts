import * as THREE from 'three';
type Quality='mobile'|'balanced'|'high';
// All detail is analytic world-space shading: no network textures or projection seams.
const noiseGLSL=`
float eh(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float en(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(eh(i),eh(i+vec3(1,0,0)),f.x),mix(eh(i+vec3(0,1,0)),eh(i+vec3(1,1,0)),f.x),f.y),mix(mix(eh(i+vec3(0,0,1)),eh(i+vec3(1,0,1)),f.x),mix(eh(i+vec3(0,1,1)),eh(i+vec3(1,1,1)),f.x),f.y),f.z);}
`;
export function createTerrainMaterial(geographic:boolean,quality:Quality){
 const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.96,metalness:0});
 m.onBeforeCompile=shader=>{
 shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vLandP; varying vec3 vLandN;').replace('#include <begin_vertex>','#include <begin_vertex>\nvLandP=(modelMatrix*vec4(position,1.)).xyz;vLandN=normalize(mat3(modelMatrix)*normal);');
 shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vLandP; varying vec3 vLandN;\n'+noiseGLSL).replace('#include <color_fragment>',`#include <color_fragment>
 float steep=1.-clamp(vLandN.y,0.,1.);float macro=en(vLandP*.003);float grain=en(vLandP*.21);float bedding=sin(vLandP.y*.13+en(vLandP*.009)*9.);float rock=smoothstep(.10,.47,steep);
 vec3 stone=mix(vec3(.25,.27,.265),vec3(.46,.445,.395),macro);stone*=.89+.11*bedding+.13*grain;
 diffuseColor.rgb=mix(diffuseColor.rgb*(.78+.29*macro+.13*grain),stone,rock*${geographic?'0.88':'0.38'});
 float frost=smoothstep(.62,.83,max(diffuseColor.r,max(diffuseColor.g,diffuseColor.b)));diffuseColor.rgb*=1.-(.06*bedding*(1.-frost));
 `);
 if(quality!=='mobile')shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
 // Fine relief perturbs the lighting normal, never coastline or collision geometry.
 vec3 detailN=vec3(en(vLandP*.36+vec3(1,0,0))-.5,en(vLandP*.36+vec3(0,1,0))-.5,en(vLandP*.36+vec3(0,0,1))-.5);
 normal=normalize(normal+mat3(viewMatrix)*detailN*.14);
 `);
 };m.customProgramCacheKey=()=>`elaris-material-22-${geographic}-${quality}`;return m;
}
export function createWaterMaterial(time:{value:number},kind:'river'|'lake'|'ocean',quality:Quality){
 const m=new THREE.MeshStandardMaterial({color:0xffffff,roughness:kind==='river'?.34:.25,metalness:.08,transparent:true,opacity:.94,side:THREE.DoubleSide,depthWrite:false});
 m.onBeforeCompile=shader=>{shader.uniforms.uWaterTime=time;
 shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 hydro; varying vec3 vHydro;varying vec3 vWaterWorld;').replace('#include <begin_vertex>','#include <begin_vertex>\nvHydro=hydro;vWaterWorld=(modelMatrix*vec4(position,1.)).xyz;');
 shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform float uWaterTime;varying vec3 vHydro;varying vec3 vWaterWorld;').replace('#include <color_fragment>',`#include <color_fragment>
 float depth=max(0.,vHydro.x);float deep=1.-exp(-depth/${kind==='ocean'?'28.':'7.'});
 vec3 shallow=vec3(.19,.36,.32),deepColor=vec3(${kind==='ocean'?'.025,.095,.15':kind==='lake'?'.045,.16,.20':'.075,.20,.19'});
 diffuseColor.rgb=mix(shallow,deepColor,deep);diffuseColor.a=mix(.30,.96,deep);
 float edge=1.-smoothstep(.05,1.1,depth);float foam=pow(max(0.,sin(vWaterWorld.x*.13+vWaterWorld.z*.09-uWaterTime)),8.)*edge;
 diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.68,.75,.69),foam*.18);
 `).replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
 vec2 flow=length(vHydro.yz)>.01?normalize(vHydro.yz):vec2(.7,.3);vec2 p=vWaterWorld.xz*.075-flow*uWaterTime*${kind==='river'?'1.6':'.35'};
 vec3 wave=vec3(sin(p.x+sin(p.y*.7)),0.,cos(p.y+p.x*.4));normal=normalize(normal+mat3(viewMatrix)*wave*${quality==='mobile'?'.045':'.09'});
 `).replace('#include <opaque_fragment>',`float fresnel=pow(1.-abs(dot(normal,normalize(vViewPosition))),4.);outgoingLight=mix(outgoingLight,vec3(.31,.43,.49),fresnel*.30);\n#include <opaque_fragment>`);
 };m.customProgramCacheKey=()=>`water-22-${kind}-${quality}`;return m;
}
