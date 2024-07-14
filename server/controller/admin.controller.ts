import { BaseController } from './base.controller';
import { statusResponse ,CodeStatut } from '../helper';
import { Request , Response } from 'express';
import { Token } from '../db';
import { matterService } from '../db/service';

export class AdminController extends BaseController{
    async suspendMatter(req:Request , res:Response){
        if(req.params.id){
            try {
                const userToken = req.body.token as Token;
                if(typeof userToken.scope ==='string'){
                    if(userToken.scope !== 'suspend:matter')
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de suspension de matière !`
                        );
                }else if(typeof userToken.scope === 'undefined'){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune Permission de suspension de matière !`
                    );
                }else{
                    if(!userToken.scope.includes('suspend:matter'))
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de suspension de matière !`
                        );
                }
                const matterFind = await matterService.findMatterById(parseInt(req.params.id));
                if(matterFind === null){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucune matière d'identifiant ${req.params.id}`
                    )
                }
                await matterService.suspendMatter(matterFind);
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `matière bien suspendu`,
                    matterFind
                )
            } catch (error) {
                return statusResponse.sendResponseJson(
                    CodeStatut.SERVER_STATUS,
                    res,
                    `Erreur au niveau du serveur , réessayer plus tard !`,
                    error
                )
            }
        }
    }
}