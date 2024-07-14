import { Request ,Response} from 'express';
import { BaseController } from './base.controller';
import { statusResponse, CodeStatut } from '../helper';
import { Token } from '../db';
import {followMatterService , matterService} from '../db/service';

export class FollowMatterController extends BaseController{

    async findFollowUser(req:Request, res:Response){
        try {
            const limit = req.query.limit? parseInt(req.query.limit as string) : undefined;
            const userToken = req.body.token as Token;
            const tableMatter =  await followMatterService.findMatterFollow(userToken.userId, limit);
            return statusResponse.sendResponseJson(
                CodeStatut.VALID_STATUS,
                res,
                `Vous suivez ${tableMatter.count} matière(s) !!`,
                tableMatter.rows
            );
        } catch (error) {
            return statusResponse.sendResponseJson(
                CodeStatut.SERVER_STATUS,
                res,
                `Erreur au niveau du serveur réesayer plus tard`,
                error
            );
        }    
    }
    
    async desSubscribeMatter(req:Request , res:Response){
        if(req.params.id){
            try {
                const userToken = req.body.token as Token
                if(typeof userToken.scope ==='string'){
                    if(userToken.scope !== 'deSubscribed:matter')
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de désabonnement à une matière !`
                        );
                }else if(typeof userToken.scope === 'undefined'){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune Permission de désabonnement à une matière  !`
                    );
                }else{
                    if(!userToken.scope.includes('deSubscribed:matter'))
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de désabonnement à une matière !`
                        );
                }
                const domainFind = await matterService.findMatterById(parseInt(req.params.id));
                if(domainFind === null) {
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucune matière d'identifiant ${req.params.id}!`
                    );
                }
                
                await followMatterService.deSubscribeMatter(userToken.userId , parseInt(req.params.id));
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `Vous êtes désabonnée avec success !!`,
                );
            } catch (error) {
                return statusResponse.sendResponseJson(
                    CodeStatut.SERVER_STATUS,
                    res,
                    `Erreur au niveau du serveur réesayer plus tard`,
                    error
                );
            }
        }
    }
}