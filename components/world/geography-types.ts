export type GeographicFeature={id:string;name:string;points:number[][];status:string;geometryStatus:string;sourceIds:string[]};
export type GeographyData={
 schemaVersion:number;id:string;name:string;seed:number;extent:number;
 registration:{reference:string;sourceId:string;coordinates:string;status:string;note:string};
 metrics:{status:string;units:string;width:number;note:string};
 boundary:GeographicFeature;islands:GeographicFeature[];
 mountains:(GeographicFeature&{height:number;width:number})[];
 plateaus:{id:string;x:number;z:number;rx:number;rz:number;height:number;status:string}[];
 hydrology:{status:string;note:string;rivers:(GeographicFeature&{width:number;outlet:string|null;identityStatus?:string})[];lakes:{id:string;name:string;x:number;z:number;rx:number;rz:number;outlet:string;outletZ:number;status:string;geometryStatus:string}[];unresolvedNames:string[]};
 climate:{status:string;northTemperature:number;southTemperature:number;lapseRate:number;prevailingWind:string;rainfall:number;note:string};
 regions:{id:string;name:string;bounds:number[];status:string}[];
 landmarks:{name:string;x:number;z:number;status:string}[];
 spatialLinks:{entityId:string;entityType:string;continent:string|null;region:string|null;status:string;relation:string;sourceIds:string[]}[];
};
