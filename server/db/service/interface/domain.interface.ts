import { Domain } from '../../interface';

export interface DomainInterfaceService{
    getDomainById(domainId:number):Promise<{message:string; data:Domain}>
}