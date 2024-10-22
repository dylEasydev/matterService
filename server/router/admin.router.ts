import { AdminController } from '../controller';
import { auth } from '../middleware';
import { BaseRouter } from './base.router';

class AdminRouter extends BaseRouter<AdminController>{
    public initRoute(){
        this.routerServeur.post('/:id',auth.secureMiddleware , auth.verifPermToken('restored:matter'),this.controllerService.restoreMatter);
        this.routerServeur.delete('/:id',auth.secureMiddleware , auth.verifPermToken('suspend:matter'),this.controllerService.suspendMatter);
        this.routerServeur.get('/',auth.secureMiddleware ,auth.verifPermToken('find:suspend'),this.controllerService.findAllMatterSuspend);
    }
} 

export default new AdminRouter(new AdminController()).routerServeur;