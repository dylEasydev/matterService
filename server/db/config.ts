import { Dialect , Sequelize, Transaction } from 'sequelize';
import cls from 'cls-hooked';

const transacNamespace = cls.createNamespace('very_own_namespace');
Sequelize.useCLS(transacNamespace);

const dbName_1 = process.env.DB_NAME_1 as string ;
const dbUser_1 = process.env.DB_USER_1 as string ;
const dbHost_1 = process.env.DB_HOST_1 ;
const dbDriver_1 = process.env.DB_DRIVER_1 as Dialect; 
const dbPassword_1 = process.env.DB_PASSWORD_1 as string;

const dbName_2 = process.env.DB_NAME_2 as string ;
const dbUser_2 = process.env.DB_USER_2 as string ;
const dbHost_2 = process.env.DB_HOST_2 ;
const dbDriver_2 = process.env.DB_DRIVER_2 as Dialect; 
const dbPassword_2 = process.env.DB_PASSWORD_2 as string;

const dbName_3 = process.env.DB_NAME_3 as string ;
const dbUser_3 = process.env.DB_USER_3 as string ;
const dbHost_3 = process.env.DB_HOST_3 ;
const dbDriver_3 = process.env.DB_DRIVER_3 as Dialect; 
const dbPassword_3 = process.env.DB_PASSWORD_3 as string;

const sequelizedb1 = new Sequelize(dbName_1,dbUser_1,dbPassword_1,{
    host:dbHost_1,
    dialect:dbDriver_1,
    logging: false,
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    define:{
        freezeTableName: true
    }
});


const sequelizedb2 = new Sequelize(dbName_2,dbUser_2,dbPassword_2,{
    host:dbHost_2,
    dialect:dbDriver_2,
    logging: false,
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    define:{
        freezeTableName: true
    }
});


export {sequelizedb1, sequelizedb2 };