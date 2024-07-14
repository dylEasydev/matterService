import { Request , Response } from 'express';
import { BaseController } from './base.controller';
import { Token } from '../db';
import { statusResponse ,CodeStatut } from '../helper';
import { DomainService, matterService } from '../db/service';
import { ValidationError } from 'sequelize';
import { RequestError } from '../db/service/domain.service';

export class MatterController extends BaseController{
    
    async createMatter(req:Request ,res:Response){
        try {
            const userToken = req.body.token as Token;
            if(typeof userToken.scope ==='string'){
                if(userToken.scope !== 'created:matter')
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune Permission de création de matière !`
                    );
            }else if(typeof userToken.scope === 'undefined'){
                return statusResponse.sendResponseJson(
                    CodeStatut.NOT_PERMISSION_STATUS,
                    res,
                    `Aucune Permission de création de matière !`
                );
            }else{
                if(!userToken.scope.includes('created:matter'))
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune Permission de création de matière !`
                    );
            }

            const {domainId , subjectName , subjectDescript} = req.body;
            const domain = (await new DomainService().getDomainById(domainId)).data;
            const newMatter = await matterService.createMatter({subjectName,subjectDescript},domain,userToken.userId);
            return statusResponse.sendResponseJson(
                CodeStatut.CREATE_STATUS,
                res,
                `la matière ${newMatter.subjectName} est bien crée`,
                newMatter
            );
        } catch (error) {
            if(error instanceof ValidationError){
                return statusResponse.sendResponseJson(
                    CodeStatut.CLIENT_STATUS,
                    res,
                    error.message,
                    error
                )
            }
            if(error instanceof RequestError){
                return statusResponse.sendResponseJson(
                    error.status,
                    res,
                    error.message,
                    error.data
                )
            }

            return statusResponse.sendResponseJson(
                CodeStatut.SERVER_STATUS,
                res,
                `Erreur au niveau du serveur , réessayer plus tard !`,
                error
            )
        }
    }

    async updateMatter(req:Request , res:Response){
        if(req.params.id){
            try {
                const userToken = req.body.token as Token;
                if(typeof userToken.scope ==='string'){
                    if(userToken.scope !== 'updated:matter')
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de mis à jour de matière !`
                        );
                }else if(typeof userToken.scope === 'undefined'){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune Permission de mis à jour de matière !`
                    );
                }else{
                    if(!userToken.scope.includes('updated:matter'))
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de mis à jour de matière !`
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
                if(matterFind.userId !== userToken.userId){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `pas de permission pour modifier cette matière , elle n'est pala votre !`
                    )
                }
                const {subjectDescript, subjectName } = req.body;
                const matterUpdate = await matterService.updateMatter(matterFind,{subjectDescript, subjectName});
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `matière bien mis à jour `,
                    matterUpdate
                );
            } catch (error) {
                if(error instanceof ValidationError){
                    return statusResponse.sendResponseJson(
                        CodeStatut.CLIENT_STATUS,
                        res,
                        error.message,
                        error
                    )
                }
                return statusResponse.sendResponseJson(
                    CodeStatut.SERVER_STATUS,
                    res,
                    `Erreur au niveau du serveur , réessayer plus tard`,
                    error
                )
            }
        }
    }

    async findMatterById(req:Request , res:Response){
        if(req.params.id){
            try {
                const matterFind = await matterService.findMatterById(parseInt(req.params.id));
                if(matterFind === null){
                    return statusResponse.sendResponseJson(
                        CodeStatut.CLIENT_STATUS,
                        res,
                        `Aucune matière d'identifiant ${req.params.id}`
                    )
                }
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `matière d'identifiant ${req.params.id} bien trouvé`,
                    matterFind
                )
            } catch (error) {
                return statusResponse.sendResponseJson(
                    CodeStatut.SERVER_STATUS,
                    res,
                    `Erreur au niveau du serveur , réessayé plus tard!`,
                    error
                )
            }
        }
    }

    async findMatterByName(req:Request , res:Response){
        if(req.params.name){
            try {
                const matterFind = await matterService.findMatterByName(req.params.name);
                if(matterFind === null){
                    return statusResponse.sendResponseJson(
                        CodeStatut.CLIENT_STATUS,
                        res,
                        `Aucune matière de noms ${req.params.name}`
                    )
                }
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `matière de noms ${req.params.name} bien trouvé`,
                    matterFind
                )
            } catch (error) {
                return statusResponse.sendResponseJson(
                    CodeStatut.SERVER_STATUS,
                    res,
                    `Erreur au niveau du serveur , réessayé plus tard!`,
                    error
                )
            }
        }
    }

    async deleteMatter(req:Request , res:Response){
        if(req.params.id){
            try {
                const userToken = req.body.token as Token;
                if(typeof userToken.scope ==='string'){
                    if(userToken.scope !== 'deleted:matter')
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de suppression de matière !`
                        );
                }else if(typeof userToken.scope === 'undefined'){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune Permission de suppression de matière !`
                    );
                }else{
                    if(!userToken.scope.includes('deleted:matter'))
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de suppression de matière !`
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
                if(matterFind.userId !== userToken.userId){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `pas de permission pour supprimer cette matière , elle n'est pala votre !`
                    )
                }
                await matterService.deleteMatter(matterFind);
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `matière bien supprimé`,
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

    async findAllMatter(req:Request, res:Response){
        try {
            const limit = (req.query.limit)?parseInt(req.query.limit as string):undefined;
            if(req.query.searh){
                const search = req.query.search as string;
                if(search.length < 2){
                    return statusResponse.sendResponseJson(
                        CodeStatut.CLIENT_STATUS,
                        res,
                        `vous devez donner au moins 2 carractères pour effectuer la recherche!`
                    );
                }
                const tableMatter = await matterService.findAllMatter(limit , search);
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `Nous avons trouver ${tableMatter.count} résultats au terme de recherche ${search}!`,
                    tableMatter.rows
                );
            }
            const tableMatter = await matterService.findAllMatter(limit);
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

    async followMatter(req:Request , res:Response){
        if(req.params.id){
            try {
                const userToken = req.body.token as Token
                if(typeof userToken.scope ==='string'){
                    if(userToken.scope !== 'subscribed:matter')
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de subcription à une matière !`
                        );
                }else if(typeof userToken.scope === 'undefined'){
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune Permission de subcription à une matière!`
                    );
                }else{
                    if(!userToken.scope.includes('subscribed:matter'))
                        return statusResponse.sendResponseJson(
                            CodeStatut.NOT_PERMISSION_STATUS,
                            res,
                            `Aucune Permission de subcription à une matière!`
                        );
                }
                const matterFind = await matterService.findMatterById(parseInt(req.params.id));
                if(matterFind === null) {
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_FOUND_STATUS,
                        res,
                        `Aucune matière d'identifiant ${req.params.id}!`
                    );
                } 
                await matterService.followMatter(matterFind,userToken.userId);
                return statusResponse.sendResponseJson(
                    CodeStatut.VALID_STATUS,
                    res,
                    `Vous suivez Bien le domaine ${matterFind.subjectName}`
                );
            } catch (error) {
                if(error instanceof ValidationError){
                    return statusResponse.sendResponseJson(
                        CodeStatut.CLIENT_STATUS,
                        res,
                        error.message,
                        error
                    );
                }
                
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