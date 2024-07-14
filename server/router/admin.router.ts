import { AdminController } from '../controller';
import { auth } from '../middleware';
import { BaseRouter } from './base.router';

class AdminRouter extends BaseRouter<AdminController>{
    public initRoute(){
        this.routerServeur.delete('/',auth.secureMiddleware , this.controllerService.suspendMatter)
    }
} 

export default new AdminRouter(new AdminController()).routerServeur;