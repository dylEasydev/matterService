import { DomainController } from '../controller';
import { BaseRouter } from './base.router';

class DomainRouter extends BaseRouter<DomainController>{

    public initRoute(): void {
        this.routerServeur.get('/:id',this.controllerService.findAllMatter);
    }

}
export default new DomainRouter(new DomainController()).routerServeur;