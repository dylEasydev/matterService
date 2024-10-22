import { Response ,Request } from 'express';
import { CodeStatut, generateToken, statusResponse } from '../helper';
import { Token } from '../db';
import {JsonWebTokenError , NotBeforeError , TokenExpiredError} from 'jsonwebtoken';

class AuthToken {

    async secureMiddleware(req:Request ,res:Response ,next :()=>void){
       try {
            const bearerToken = req.headers.authorization;

            if(!bearerToken){
                return statusResponse.sendResponseJson(
                    CodeStatut.NOT_PERMISSION_STATUS,
                    res,
                    `Aucun Token n'as été fourni !`
                );
            }

            const token = bearerToken.split(' ')[1];
            if(!token){
                return statusResponse.sendResponseJson(
                    CodeStatut.NOT_PERMISSION_STATUS,
                    res,
                    `Aucun Token n'as été fourni !`
                );
            }
            req.body.token = await generateToken.verifyToken<Token>(token);
            next();
       } catch (error) {
            if((error instanceof JsonWebTokenError)||(error instanceof NotBeforeError)||(error instanceof TokenExpiredError)){
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
                `Erreur au niveau du serveur réesayer plus tard !`
            )
       }
    }
    verifPermToken(permName: string){
        return async (req:Request , res:Response , next:()=>void)=>{
            const token = req.body.token as Token
            if(typeof token.scope ==='string'){
                if(token.scope !== permName)
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune permissions !`
                    );
            }else if(typeof token.scope === 'undefined'){
                return statusResponse.sendResponseJson(
                    CodeStatut.NOT_PERMISSION_STATUS,
                    res,
                    `Aucune permissions !`
                );
            }else{
                if(!token.scope.includes(permName))
                    return statusResponse.sendResponseJson(
                        CodeStatut.NOT_PERMISSION_STATUS,
                        res,
                        `Aucune permissions !`
                    );
                next();
            }
        }
    }
}

export default new AuthToken();