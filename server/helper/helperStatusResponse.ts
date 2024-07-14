import { Response } from 'express';
export enum CodeStatut{
    VALID_STATUS = 200,
    CREATE_STATUS = 201,
    SERVER_STATUS = 500,
    NOT_FOUND_STATUS = 404,
    CLIENT_STATUS = 400,
    UNAUTH_STATUS = 401,
    NOT_PERMISSION_STATUS = 403
};
export class StatusResponse{
    public sendResponseJson(code:CodeStatut , res: Response ,message:string , data?:unknown){
        return res.status(code).json({message:message , data:data});
    }
    public sendResponseFile(code:CodeStatut , res:Response , path:string){
        return res.status(code).sendFile(path);
    }
}

export default new StatusResponse();