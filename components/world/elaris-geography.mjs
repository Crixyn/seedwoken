// Reference-space reconstruction. UV is registered to the accepted oblique plate,
// not a surveyed projection. All numerical metrics are EXPERIMENTAL.
const uv = points => points.map(([u,v])=>[u*2-1,v*2-1]);
const feature=(id,name,points,extra={})=>({id,name,points:uv(points),status:'SUPPORTED',geometryStatus:'INFERENCE',sourceIds:['codex-plate-elaris'],...extra});
export const classifications=['CANON','SUPPORTED','INFERENCE','PROPOSAL','EXPERIMENTAL','CONFLICT','UNKNOWN','REJECTED'];
export const elarisGeography={
 schemaVersion:1,id:'elaris',name:'Elaris — The Mainland',seed:1701,extent:60000,
 registration:{reference:'/world/references/elaris.webp',sourceId:'codex-plate-elaris',coordinates:'normalized reference-image UV, north at top',status:'INFERENCE',note:'Oblique illustration traced into plan space. Perspective, hidden slopes and absolute dimensions remain unresolved.'},
 metrics:{status:'EXPERIMENTAL',units:'model metres',width:120000,note:'120 km evaluation domain; substantially enlarged but still compressed. No canonical continental size or elevations are established.'},
 boundary:feature('mainland','Mainland silhouette',[[.36,.085],[.43,.068],[.49,.09],[.57,.058],[.66,.033],[.74,.059],[.81,.115],[.875,.083],[.914,.104],[.908,.145],[.882,.152],[.882,.20],[.863,.235],[.897,.258],[.879,.308],[.914,.344],[.912,.393],[.879,.417],[.897,.44],[.865,.468],[.875,.502],[.846,.529],[.814,.532],[.80,.581],[.854,.612],[.865,.651],[.901,.651],[.92,.7],[.952,.718],[.95,.777],[.922,.778],[.903,.735],[.872,.728],[.852,.754],[.826,.768],[.795,.739],[.758,.735],[.724,.705],[.691,.693],[.646,.679],[.596,.676],[.557,.706],[.52,.748],[.493,.77],[.457,.79],[.437,.75],[.46,.715],[.411,.699],[.421,.676],[.365,.677],[.331,.69],[.299,.67],[.298,.635],[.33,.615],[.327,.60],[.30,.594],[.276,.61],[.248,.607],[.216,.626],[.183,.626],[.161,.602],[.18,.572],[.177,.548],[.132,.536],[.119,.57],[.079,.587],[.037,.568],[.052,.532],[.089,.516],[.134,.523],[.169,.503],[.172,.474],[.197,.452],[.18,.432],[.203,.405],[.183,.379],[.142,.386],[.151,.35],[.19,.317],[.183,.29],[.212,.268],[.267,.279],[.299,.254],[.286,.225],[.309,.213],[.297,.198],[.339,.191],[.369,.211],[.411,.204],[.396,.177],[.409,.163],[.386,.148],[.417,.141],[.432,.12],[.404,.109]]),
 islands:[
 feature('west-north','Western island chains',[[.065,.222],[.103,.232],[.134,.221],[.151,.241],[.12,.27],[.076,.286],[.059,.27]]),
 feature('west-mid','Western island chains',[[.095,.30],[.129,.292],[.146,.309],[.119,.34],[.088,.337]]),
 feature('west-south','Western island chains',[[.064,.345],[.086,.355],[.078,.391],[.049,.407],[.036,.39]]),
 feature('west-bay-island','Southwestern bay islands',[[.127,.435],[.166,.426],[.181,.447],[.154,.48],[.102,.478]]),
 feature('southwest-arc','Southern archipelagos',[[.139,.674],[.174,.671],[.207,.686],[.232,.68],[.25,.719],[.238,.75],[.206,.749],[.19,.721],[.154,.718]]),
 feature('southwest-large','Southern archipelagos',[[.173,.765],[.199,.757],[.224,.772],[.247,.794],[.247,.827],[.229,.859],[.20,.849],[.187,.824],[.143,.811],[.128,.787]]),
 feature('south-island','Southern archipelagos',[[.483,.798],[.525,.782],[.559,.789],[.558,.815],[.584,.827],[.568,.854],[.526,.842],[.506,.853],[.476,.833]]),
 feature('south-east-island','Southern archipelagos',[[.59,.823],[.615,.807],[.65,.80],[.666,.773],[.691,.793],[.706,.837],[.748,.85],[.751,.886],[.72,.882],[.703,.907],[.668,.883],[.638,.891],[.627,.855]]),
 feature('south-tip','Southern archipelagos',[[.763,.889],[.79,.909],[.787,.938],[.759,.936],[.742,.914]]),
 feature('south-west-tip','Southern archipelagos',[[.393,.816],[.426,.807],[.449,.826],[.439,.852],[.402,.878],[.369,.873],[.367,.849]]),
 feature('east-islands','Southeastern coast islands',[[.858,.456],[.887,.446],[.924,.468],[.944,.487],[.924,.514],[.9,.519],[.9,.49],[.868,.491]]),
 ],
 mountains:[
 feature('northern-arc','Northern source highlands',[[.414,.085],[.48,.113],[.55,.105],[.62,.074],[.687,.058],[.746,.109],[.784,.143]],{height:2900,width:.065}),
 feature('lake-divide','Northern lake divides',[[.46,.2],[.52,.205],[.577,.178],[.655,.177],[.712,.144]],{height:1200,width:.03}),
 feature('western-spine','Western upland divides',[[.285,.253],[.37,.30],[.328,.351],[.242,.375],[.254,.421],[.206,.477],[.249,.515]],{height:1100,width:.035}),
 feature('eastern-spine','Eastern upland divides',[[.783,.273],[.753,.319],[.781,.351],[.745,.397],[.733,.465],[.764,.49],[.748,.56]],{height:1400,width:.036}),
 ],
 plateaus:[{id:'east-tableland',x:.49,z:-.08,rx:.14,rz:.20,height:420,status:'INFERENCE'}],
 hydrology:{status:'INFERENCE',note:'Vaelorin identity and southward drainage are canon. Digitized courses, channel widths, water levels and catchment boundaries are inferred. Named tributaries are not arbitrarily assigned to visible channels.',
 rivers:[
 feature('vaelorin','Vaelorin',[[.695,.252],[.661,.274],[.631,.29],[.637,.311],[.60,.331],[.57,.345],[.55,.361],[.554,.381],[.536,.4],[.509,.406],[.519,.42],[.543,.431],[.55,.445],[.535,.46],[.54,.477],[.563,.488],[.572,.505],[.594,.514],[.591,.53],[.568,.542],[.571,.558],[.587,.575],[.596,.596],[.571,.616],[.565,.635],[.579,.658],[.572,.682],[.552,.704],[.556,.731],[.54,.753],[.51,.782],[.477,.804]],{width:.006,outlet:null,identityStatus:'CANON'}),
 feature('northwest-tributary','Unassigned northern tributary',[[.5375,.207],[.535,.217],[.544,.249],[.508,.27],[.496,.285],[.52,.302],[.524,.331],[.55,.361]],{width:.003,outlet:'vaelorin'}),
 feature('west-tributary','Unassigned western tributary',[[.374,.352],[.39,.38],[.429,.388],[.47,.398],[.509,.406]],{width:.003,outlet:'vaelorin'}),
 feature('east-tributary','Unassigned eastern tributary',[[.7875,.4065],[.744,.42],[.727,.439],[.698,.457],[.652,.467],[.61,.48],[.563,.488]],{width:.003,outlet:'vaelorin'}),
 feature('southwest-tributary','Unassigned southwestern tributary',[[.32,.507],[.356,.515],[.415,.517],[.456,.521],[.503,.54],[.568,.542]],{width:.003,outlet:'vaelorin'}),
 feature('delta-east','Eastern distributary',[[.596,.596],[.617,.623],[.622,.659],[.635,.681],[.659,.716],[.69,.746],[.703,.772]],{width:.007,outlet:null}),
 feature('delta-mid','Central distributary',[[.579,.658],[.602,.688],[.608,.717],[.637,.749],[.64,.78]],{width:.004,outlet:null}),
 ],
 lakes:[{id:'north-west-lake',name:'Northern lake country',x:.075,z:-.633,rx:.085,rz:.047,outlet:'northwest-tributary',outletZ:-.586,status:'SUPPORTED',geometryStatus:'INFERENCE'},
 {id:'north-east-lake',name:'Vaelorin headwater lake',x:.39,z:-.57,rx:.072,rz:.074,outlet:'vaelorin',outletZ:-.496,status:'SUPPORTED',geometryStatus:'INFERENCE'},
 {id:'east-lake',name:'Eastern lake basin',x:.575,z:-.232,rx:.035,rz:.045,outlet:'east-tributary',outletZ:-.187,status:'SUPPORTED',geometryStatus:'INFERENCE'}],
 unresolvedNames:['Silren','Mossrun','Avenwater','Briarwash','Orin’s Fork']},
 climate:{status:'EXPERIMENTAL',northTemperature:2,southTemperature:23,lapseRate:.006,prevailingWind:'west-to-east',rainfall:1100,note:'Latitude is a north–south proxy. Westerly wind, lapse rate, rainfall and soil proxies are model assumptions, not established Vaeloran measurements.'},
 regions:[
 {id:'north',name:'Northern source highlands',bounds:[-.3,-1,1,-.69],status:'SUPPORTED'},
 {id:'lakes',name:'Northern lake country',bounds:[-.3,-.69,1,-.45],status:'SUPPORTED'},
 {id:'west',name:'Western island coast',bounds:[-1,-.6,-.62,.3],status:'SUPPORTED'},
 {id:'delta',name:'Vaelorin wetland delta',bounds:[.04,.17,.43,.63],status:'SUPPORTED'},
 {id:'bay',name:'Southwestern bay',bounds:[-1,.10,-.28,.52],status:'SUPPORTED'},
 {id:'south',name:'Southern archipelagos',bounds:[-1,.52,1,1],status:'SUPPORTED'},
 {id:'east',name:'Eastern uplands and coast',bounds:[.42,-.45,1,.52],status:'SUPPORTED'},
 {id:'interior',name:'Temperate river country',bounds:[-1,-1,1,1],status:'SUPPORTED'}],
 landmarks:[{name:'Northern mountain divide',x:.29,z:-.83},{name:'Northern lake overlook',x:.01,z:-.57},{name:'Vaelorin headwaters',x:.29,z:-.47},{name:'Western island chains',x:-.80,z:-.48},{name:'Temperate river valley',x:.055,z:-.14},{name:'Eastern rain-shadow study',x:.63,z:-.08},{name:'Southwestern bay',x:-.44,z:.16},{name:'Vaelorin delta overlook',x:.07,z:.40},{name:'Southern archipelago',x:.36,z:.71}].map(p=>({...p,status:'INFERENCE'})),
 spatialLinks:[
 {entityId:'vaelorin',entityType:'geographic-record',continent:'elaris',region:'interior',status:'CANON',relation:'river-identity; exact geometry INFERENCE',sourceIds:['codex-plate-elaris','f65554bb0c98aaf6']},
 {entityId:'southern-wetlands',entityType:'ecological-region',continent:'elaris',region:'delta',status:'SUPPORTED',relation:'warm wetland environment; quantitative climate EXPERIMENTAL',sourceIds:['codex-plate-elaris','f65554bb0c98aaf6']},
 {entityId:'codex-plate-elaris',entityType:'reference',continent:'elaris',region:null,status:'CANON',relation:'geographic-reference',sourceIds:['codex-plate-elaris']},
 {entityId:'f65554bb0c98aaf6',entityType:'codex',continent:'elaris',region:null,status:'CANON',relation:'describes',sourceIds:['f65554bb0c98aaf6']},
 ...['rosavyn','solavyr','tomavyn','lilavyn','irivyn','lilloryn'].map(entityId=>({entityId,entityType:'species',continent:null,region:null,status:'UNKNOWN',relation:'native-range',sourceIds:['f65554bb0c98aaf6']})),
 {entityId:'7607397d8bddcece',entityType:'reference',continent:'elaris',region:null,status:'CONFLICT',relation:'alternate-unverified-depiction',sourceIds:['7607397d8bddcece','codex-plate-elaris']}
 ]
};
