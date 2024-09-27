import { 
    CreationOptional, InferAttributes, InferCreationAttributes,Model
} from 'sequelize';

import {ImageInterface} from '../interface';

export class Image extends Model<
    InferAttributes<Image>,
    InferCreationAttributes<Image>
>implements ImageInterface{
    
    declare id:CreationOptional<number>;
    declare picturesName:CreationOptional<string>;
    declare urlPictures:CreationOptional<string>;
    declare nameTable: CreationOptional<string>;

    declare readonly createdAt:CreationOptional<Date>;
    declare readonly updatedAt:CreationOptional<Date>;
    declare readonly deletedAt:CreationOptional<Date>;

    declare foreignId: CreationOptional<number>;

}