import { DataTypes } from 'sequelize';
import { sequelizedb2 } from '../config';
import { Matter } from '../models';

Matter.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true
    },
    subjectName:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:{msg:`Veillez fournir un nom à Votre matière`},
            notNull:{msg:`Veillez fournir un nom à Votre matière`},
            len:{
                msg:`le nom de la matière doit être entre 4 et 30 carractères`,
                args: [4 , 30]
            },
            validatePicturesName(value:string){
                if(!value) throw new Error(`Veillez fournir un nom à Votre matière`);
                if(value.length < 4) throw new Error(`Fournissez au moins 4 carractères pour votre nom de matière !`);
            }
        }
    },
    userId:{
        type:DataTypes.INTEGER
    },
    domainId:{
        type:DataTypes.INTEGER
    },
    subjectDescript:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    createdAt: DataTypes.DATE ,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
},{
    sequelize:sequelizedb2,
    paranoid:true,
    timestamps:true,
    tableName:'matter'
})

export {Matter};