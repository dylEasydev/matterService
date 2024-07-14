import {sequelizedb1} from '../config';
import{DataTypes} from 'sequelize';
import { Image } from '../models';
import { __urlImage } from '../../global_dir';

Image.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true
    },
    picturesName:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:`profil_default.png`,
        validate:{
            notEmpty:{msg:`Veillez fournir un nom à Votre image`},
            notNull:{msg:`Veillez fournir un nom à Votre image`},
            len:{
                msg:`le nom de l'image doit être entre 4 et 30 carractères`,
                args: [4 , 30]
            },
            validatePicturesName(value:string){
                if(!value) throw new Error(`Veillez fournir un nom à Votre image`);
                if(value.includes(' '))throw new Error(`Pas d'espace Blancs dans le nom d'image`);
            }
        }
    },
    urlPictures:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:`${__urlImage}/public/profil_default.png`,
        validate:{
            notEmpty:{msg:`Veillez fournir une url à votre image`},
            notNull:{msg:`Veillez fournir une url à votre image`},
            isUrl:{msg:`Veillez fournir une url valide`}
        }
    },
    nameTable:{
        type:DataTypes.STRING,
        allowNull:false
    },
    foreignId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    createdAt: DataTypes.DATE ,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
},{
    sequelize:sequelizedb1,
    paranoid:true,
    timestamps:true,
    tableName:'image'
})

export {Image};