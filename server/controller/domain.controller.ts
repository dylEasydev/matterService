import { BaseController } from './base.controller';
import { Request , Response } from 'express';
import {statusResponse , CodeStatut} from '../helper';
import { matterService } from '../db/service';

export class DomainController extends BaseController{
    async findAllMatter(req:Request, res:Response){
        if(req.params.id){
            try {
                const domainId = isNaN(parseInt(req.params.id))?0:parseInt(req.params.id);
                const limit = (typeof req.query.limit === 'string')?parseInt(req.query.limit):undefined;
                if(req.query.searh){
                    const search = (typeof req.query.search === 'string')? req.query.search:'';
                    if(search.length < 2){
                        return statusResponse.sendResponseJson(
                            CodeStatut.CLIENT_STATUS,
                            res,
                            `vous devez donner au moins 2 carractères pour effectuer la recherche!`
                        );
                    }
                    const tableMatter = await matterService.findAllMatterDomain(domainId,limit , search);
                    return statusResponse.sendResponseJson(
                        CodeStatut.VALID_STATUS,
                        res,
                        `Nous avons trouver ${tableMatter.count} résultats au terme de recherche ${search}!`,
                        tableMatter.rows
                    );
                }
                const tableMatter = await matterService.findAllMatterDomain(domainId,limit);
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
    
}