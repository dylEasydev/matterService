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
                const id = isNaN(parseInt(req.params.id))?0:parseInt(req.params.id);
                const matterFind = await matterService.findMatterById(id);
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

    async restoreMatter(req:Request , res:Response){
        if(req.params.id){
            try {
                const userToken = req.body.token as Token;
                if(typeof userToken.scope ==='string'){
                    if(userToken.scope !== 'restored:matter')
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de restaurer une matière !`
                        );
                }else if(typeof userToken.scope === 'undefined'){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune Permission de restaurer une matière !`
                    );
                }else{
                    if(!userToken.scope.includes('restored:matter'))
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de restaurer une matière !`
                        );
                }
                const id = isNaN(parseInt(req.params.id))?0:parseInt(req.params.id);
                const matterRestore = await matterService.restoreMatter(id);
                if(matterRestore === null){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucune matière d'identifiant ${req.params.id} trouvée ! `
                    );
                }
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `matière ${matterRestore.subjectName} à bien été restaurer !`,
                    matterRestore
                );
            } catch (error) {
                return statusResponse.sendResponseJson(
                    CodeStatut.SERVER_STATUS,
                    res,
                    `Erreur au niveau du serveur , réessayer plus tard !`,
                    error
                );
            }
        }
    }

    async findAllMatterSuspend(req:Request, res:Response){
        try {
            const userToken = req.body.token as Token;
                if(typeof userToken.scope ==='string'){
                    if(userToken.scope !== 'find:suspend')
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission !`
                        );
                }else if(typeof userToken.scope === 'undefined'){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune Permission !`
                    );
                }else{
                    if(!userToken.scope.includes('find:suspend'))
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission !`
                        );
                }
            const limit = (typeof req.query.limit === 'string')?parseInt(req.query.limit):undefined;
            if(req.query.searh){
                const search = (typeof req.query.search === 'string')? req.query.search : '';
                if(search.length < 2){
                    return statusResponse.sendResponseJson(
                        CodeStatut.CLIENT_STATUS,
                        res,
                        `vous devez donner au moins 2 carractères pour effectuer la recherche!`
                    );
                }
                const tableMatter = await matterService.findAllMatterSuspend(limit , search);
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `Nous avons trouver ${tableMatter.count} résultats au terme de recherche ${search}!`,
                    tableMatter.rows
                );
            }
            const tableMatter = await matterService.findAllMatterSuspend(limit);
            return statusResponse.sendResponseJson(
                CodeStatut.VALID_STATUS,
                res,
                `Nous avons trouver ${tableMatter.count} matière au totale !`,
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
}