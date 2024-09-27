import { UserController } from '../controller';
import { BaseRouter } from './base.router';

class userRouter extends BaseRouter<UserController>{
    public initRoute(): void {
        this.routerServeur.get('/:id',this.controllerService.findAllMatter);
    }
}

export default new userRouter(new UserController()).routerServeur;