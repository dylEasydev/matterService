import { AdminController } from '../controller';
import { auth } from '../middleware';
import { BaseRouter } from './base.router';

class AdminRouter extends BaseRouter<AdminController>{
    public initRoute(){
        this.routerServeur.post('/:id',auth.secureMiddleware , this.controllerService.restoreMatter);
        this.routerServeur.delete('/:id',auth.secureMiddleware , this.controllerService.suspendMatter);
        this.routerServeur.get('/',auth.secureMiddleware ,this.controllerService.findAllMatterSuspend);
    }
} 

export default new AdminRouter(new AdminController()).routerServeur;