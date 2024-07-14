import {availableParallelism} from 'node:os';
import cluster from 'node:cluster';

export const launchCluster = ()=>{
    let numberCluster = availableParallelism();

    for(let i = 0 ;i < numberCluster; i++){
        const worker = cluster.fork();

        worker.on('message',(message)=>{
            console.log(message);
        })
    }

    cluster.on('online',(worker)=>{
        console.log(`Worker ${worker.process.pid} is listening`);
    })

    cluster.on('exit',(worker,code,signal)=>{
        console.log(`Worker ${worker.process.pid} est mort avec le code ${code} et le signal ${signal}`);

        const newWorker = cluster.fork();
        newWorker.on('message',(message)=>{
            console.log(message);
        })
    })
}