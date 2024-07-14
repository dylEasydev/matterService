import { IndexController } from '../controller';
import { BaseRouter } from './base.router';

export class IndexRouter extends BaseRouter<IndexController>{
    
    public initRoute(): void {
        this.routerServeur.get('/',this.controllerService.accueilService);
        this.routerServeur.get('/docs',this.controllerService.documentationService);
    }
}

export default new IndexRouter(new IndexController()).routerServeur;