import { FollowMatterInterface , MatterInterface} from '../../interface';

export interface FollowMatterServiceInterface{
    findMatterFollow(userId:number,limit?:number):Promise<{count:number; rows:MatterInterface[];}>;
    deSubscribeMatter(userId:number , subjectId:number):Promise<void>;
}