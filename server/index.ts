import cluster from 'node:cluster';
import { launchCluster } from './cluster'
import { launchHttpServer } from './server';
import { initDB } from './db/initDB';

const launchServer = (isRequiredClustering:Boolean)=>{
    initDB().then(()=>console.log(`synchronisation avec la BD réussi !`)).catch(error => console.log(`Error:${error}`));
    if(isRequiredClustering && cluster.isPrimary){
        launchCluster();
    }
    else{
    	console.log(`${process.pid} is worker`);
        launchHttpServer();
    }
}

launchServer(false);
