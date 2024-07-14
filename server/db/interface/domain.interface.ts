export interface Domain{
    id:number;
    domainName:string;
    domainDescript:string;
    image?:string;
    nbreSubcribe:number;

    readonly createdAt:Date;
    readonly updatedAt:Date;
}