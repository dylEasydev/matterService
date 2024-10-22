import { MatterController } from '../controller';
import { auth } from '../middleware';
import { BaseRouter } from './base.router';

class MatterRouter extends BaseRouter<MatterController>{
    public initRoute(){
        this.routerServeur.get('/',this.controllerService.findAllMatter);
        this.routerServeur.get('/:id',this.controllerService.findMatterById);
        this.routerServeur.get('/name',this.controllerService.findMatterByName);

        this.routerServeur.put('/:id',auth.secureMiddleware,auth.verifPermToken('updated:matter'),this.controllerService.updateMatter);
        this.routerServeur.delete('/:id',auth.secureMiddleware,auth.verifPermToken('deleted:matter'),this.controllerService.deleteMatter);
        
        this.routerServeur.post('/',auth.secureMiddleware,auth.verifPermToken('created:matter'),this.controllerService.createMatter);
        this.routerServeur.post('/follow',auth.secureMiddleware,auth.verifPermToken('subscribes:matter'),this.controllerService.followMatter);
    }
}

export default new MatterRouter(new MatterController()).routerServeur;