import { sequelizedb2 } from '../config';
import {FollowMatter} from '../models';
import{DataTypes} from 'sequelize';

FollowMatter.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            isInt:{msg:`Identifiant de l'utilisateur doit être un entier !`}
        }
    },
    createdAt: DataTypes.DATE ,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
},{
    sequelize:sequelizedb2,
    paranoid:true,
    timestamps:true,
    tableName:'followMatter'
})

export {FollowMatter};