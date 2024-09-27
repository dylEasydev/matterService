export interface Domain{
    id:number;
    domainName:string;
    domainDescript:string;
    image?:string;
    nbreSubcribes:number;

    readonly createdAt:Date;
    readonly updatedAt:Date;
}