// Insert hydrology samples into existing triangles without replacing tile topology.
// Boundary rings stay untouched; shared-edge heights/normals retain M2.1 rules.
export function insertTerrainConstraints(layout,points){
 const vertices=layout.points.map(p=>[...p]),triangles=[];for(let i=0;i<layout.indices.length;i+=3)triangles.push(layout.indices.slice(i,i+3));
 const cross=(a,b,p)=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);
 for(const p of points){let found=-1;for(let i=0;i<triangles.length;i++){const t=triangles[i],a=vertices[t[0]],b=vertices[t[1]],c=vertices[t[2]];if(p[0]<Math.min(a[0],b[0],c[0])||p[0]>Math.max(a[0],b[0],c[0])||p[1]<Math.min(a[1],b[1],c[1])||p[1]>Math.max(a[1],b[1],c[1]))continue;const x=cross(a,b,p),y=cross(b,c,p),z=cross(c,a,p);if(x<-.001&&y<-.001&&z<-.001){found=i;break;}}if(found<0)continue;const [a,b,c]=triangles[found],n=vertices.length;vertices.push(p);triangles[found]=[a,b,n];triangles.push([b,c,n],[c,a,n]);}
 return {points:vertices,indices:triangles.flat(),outer:layout.outer};
}
