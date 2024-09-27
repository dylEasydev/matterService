import { MatterInterface, FollowMatterInterface, Domain } from '../../interface';

export interface MatterInterfaceService{
    createMatter<
        T extends {subjectName:string; subjectDescript?:string;}
    >(value:T ,  domain:Domain, userId:number):Promise<MatterInterface>;

    updateMatter<
        T extends {subjectName?:string; subjectDescript?:string;}
     >(instance:MatterInterface , value:T):Promise<MatterInterface>;

    findMatterById(id:number):Promise<MatterInterface|null>;
    findMatterByName(name:string):Promise<MatterInterface|null>;
    findAllMatter(limit?:number  , search? : string):Promise<{rows:MatterInterface[]; count:number;}>;
    findAllMatterSuspend(limit?:number  , search? : string):Promise<{rows:MatterInterface[]; count:number;}>;
    findAllMatterDomain(domainId:number , limit?:number  , search? : string):Promise<{rows:MatterInterface[]; count:number;}>;
    findAllMatterTeacher(userId:number , limit?:number  , search? : string):Promise<{rows:MatterInterface[]; count:number;}>;

    followMatter(instance:MatterInterface,userId:number):Promise<[FollowMatterInterface,boolean]>;
    
    deleteMatter(instance:MatterInterface):Promise<void>;
    suspendMatter(instance:MatterInterface):Promise<void>;
    restoreMatter(id:number):Promise<MatterInterface | null>;
}