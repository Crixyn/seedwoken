// Pointer ownership prevents a second finger or cancelled gesture leaving motion active.
export function createExplorationInput(){
 let owner=null,motion={x:0,y:0},vertical=0,boost=false;
 return {begin(id){if(owner!==null&&owner!==id)return false;owner=id;return true;},move(id,x,y){if(id!==owner)return;motion={x:Math.max(-1,Math.min(1,x)),y:Math.max(-1,Math.min(1,y))};},end(id){if(id===owner){owner=null;motion={x:0,y:0};}},setVertical(v){vertical=Math.max(-1,Math.min(1,v));},setBoost(v){boost=!!v;},reset(){owner=null;motion={x:0,y:0};vertical=0;boost=false;},read(){return {...motion,vertical,boost,owner};}};
}
export const qualityPresets={mobile:{pixelRatio:1,vegetation:.45,shadowSize:0},balanced:{pixelRatio:1.35,vegetation:1,shadowSize:0},high:{pixelRatio:1.75,vegetation:1.6,shadowSize:2048}};
