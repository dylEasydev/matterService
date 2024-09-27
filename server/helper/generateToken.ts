import jwt from 'jsonwebtoken';

export class GenrateToken{
    private _private_key:string;

    constructor(key:string){
        this._private_key= key;
    }
    public generate<T extends Object>(jsonData:T,time:number){
        const jeton = jwt.sign(jsonData,this._private_key,{expiresIn:time});
        return jeton;
    }

    public verifyToken<T>(token:string){
        return new Promise<T>((resolve, reject) => {
            jwt.verify(token,this._private_key,(error,decodeToken)=>{
                if(error)reject(error);
                else resolve(decodeToken as T)
            }); 
        })
    }
}

export default new GenrateToken(process.env.PRIVATE_KEY as string);