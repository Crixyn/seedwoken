// Priority-flood drainage analysis on the reconstructed surface. Depression fills
// are diagnostic, not a claim of standing water or a mutation of canonical data.
export function analyzeDrainage(model,size=129){
 const count=size*size,height=new Float32Array(count),filled=new Float32Array(count),flow=new Int32Array(count).fill(-1),accumulation=new Float32Array(count).fill(1),seen=new Uint8Array(count),catchment=new Int16Array(count).fill(-1),order=[],heap=[];
 const step=model.extent*2/(size-1),rivers=model.data.hydrology.rivers;
 const push=(i,h)=>{heap.push([i,h]);let n=heap.length-1;while(n){const p=(n-1)>>1;if(heap[p][1]<=h)break;heap[n]=heap[p];n=p;}heap[n]=[i,h];};
 const pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){let n=0;while(n*2+1<heap.length){let c=n*2+1;if(c+1<heap.length&&heap[c+1][1]<heap[c][1])c++;if(heap[c][1]>=last[1])break;heap[n]=heap[c];n=c;}heap[n]=last;}return top;};
 for(let z=0;z<size;z++)for(let x=0;x<size;x++){const i=z*size+x,s=model.surface(x/(size-1)*2-1,z/(size-1)*2-1);height[i]=Math.max(s.height,s.water);filled[i]=height[i];if(s.coast<0||x===0||z===0||x===size-1||z===size-1){seen[i]=1;push(i,height[i]);}}
 while(heap.length){const [i,h]=pop(),x=i%size,z=Math.floor(i/size);order.push(i);const water=model.waterAt(x/(size-1)*2-1,z/(size-1)*2-1);if(water.distance<Math.max(water.width,1.5/(size-1)))catchment[i]=rivers.findIndex(r=>r.id===water.id);else if(flow[i]>=0)catchment[i]=catchment[flow[i]];
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dz)continue;const nx=x+dx,nz=z+dz;if(nx<0||nz<0||nx>=size||nz>=size)continue;const j=nz*size+nx;if(seen[j])continue;seen[j]=1;flow[j]=i;filled[j]=Math.max(height[j],h);push(j,filled[j]);}}
 for(let k=order.length-1;k>=0;k--){const i=order[k];if(flow[i]>=0)accumulation[flow[i]]+=accumulation[i];}
 return {size,step,status:'EXPERIMENTAL',method:'D8 priority flood; depression-fill diagnostic; not a dynamic water simulation',height,filled,flow,accumulation,catchment};
}
