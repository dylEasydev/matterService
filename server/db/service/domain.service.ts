import { DomainInterfaceService } from './interface';
import { Domain} from '../interface';
import axios,{ AxiosInstance } from 'axios';

export class RequestError extends Error{
    public status:number;
    public data:any;
    constructor(
        status:number,
        data:any,
        message?:string
    ){
        super(message);
        this.status=status;
        this.data =data;
    }
}
export class DomainService implements DomainInterfaceService{
    public axiosRequest: AxiosInstance;

    constructor(jeton?:string){
        this.axiosRequest = axios.create({
            baseURL:'http://localhost:3002/',
            timeout:3000,
            headers:{
                Authorization:`Bearer ${jeton}`
            }
        })
    }
    getDomainById(domainId:number){
        return new Promise<{message:string; data:Domain;}>(async(resolve, reject) => {
            try {
                const domainSubcribes = await this.axiosRequest.get<
                {message:string; data:any;}
                >(`/domain/${domainId}`,{
                    validateStatus:(status:number)=>{return status < 500}
                });
                if(domainSubcribes.status < 200 || domainSubcribes.status > 300){
                    reject(
                        new RequestError(
                            domainSubcribes.status,
                            domainSubcribes.data.data,
                            domainSubcribes.data.message
                        )
                    )
                }else resolve(domainSubcribes.data as {message:string,data:Domain}); 
            } catch (error) {
               reject(error);
            }
        })
    }
}