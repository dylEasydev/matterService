import express,{Application} from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import brigde from 'http2-express-bridge';
import{
    adminRouter,followRouter,domainRouter,
    indexRouter , matterRouter,userRouter
}from './router';

class ExpressApp{
    public expressServer: Application;

    constructor(){
        this.expressServer = brigde(express);
        this.configServer();
    }

    private configServer(){
        this.expressServer.use(bodyParser.json())
                          .use(bodyParser.urlencoded({extended:true}))
                          .use(cors())
                          .use('/',indexRouter)
                          .use('/matter',matterRouter)
                          .use('/admin',adminRouter)
                          .use('/follow', followRouter)
                          .use('/domain',domainRouter)
                          .use('/user',userRouter)
                          .use('*',(req,res)=>{
                                res.redirect('/docs');
                          })
    }
}

export default new ExpressApp().expressServer