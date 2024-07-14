import expressServer from './app';
import http from 'node:http';

export const launchHttpServer = ()=>{
    const port:unknown = process.env.PORT ;
    const hostName = process.env.HOSTNAME;
    
    const authServer = http.createServer(expressServer);
     
    try {
        authServer.listen(port as number , hostName,()=>{
            console.log(`Notre serveur tourne à l'adresse http://${hostName}:${port}`)
        })
    } catch (error) {
        console.log(`Une erreur est survenu lors du démarrage du serveur\n.Veillez verifier erreur:${error} puis rédemarrer`)
    }
}