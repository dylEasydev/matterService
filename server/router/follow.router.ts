import { FollowMatterController } from '../controller';
import { auth } from '../middleware';
import { BaseRouter } from './base.router';

class FollowRouter extends BaseRouter<FollowMatterController>{
    public initRoute(){
        this.routerServeur.get('/',auth.secureMiddleware,this.controllerService.findFollowUser);
        this.routerServeur.delete('/',auth.secureMiddleware,this.controllerService.desSubscribeMatter);
    }
}

export default new FollowRouter(new FollowMatterController()).routerServeur;