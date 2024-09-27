export interface Token{
    userId:number;
    userName:string;
    scope?:string|string[];
    clientId:number;
}
