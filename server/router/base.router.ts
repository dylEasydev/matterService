import { BaseController } from '../controller';
import { Router } from 'express';
export abstract class BaseRouter <T extends BaseController>{

    public routerServeur: Router;
    public controllerService:T;
    
    constructor(controller:T){
        this.controllerService = controller;
        this.routerServeur = Router();
        this.initRoute();
    }

    public abstract initRoute():void;
}