import { Response , Request } from 'express';
import { CodeStatut, statusResponse } from '../helper';
import { BaseController } from './base.controller';
import { __basedir } from '../global_dir';
import path from 'path';

export class IndexController  extends BaseController{

    async accueilService(req:Request , res:Response){
        return statusResponse.sendResponseJson(CodeStatut.VALID_STATUS,res,`Bienvenue sur user-service-easyclass api !`);
    }

    async documentationService(req:Request , res:Response){
        return statusResponse.sendResponseFile(CodeStatut.VALID_STATUS,res,path.join(__basedir,'/docs/index.html'));
    }
}