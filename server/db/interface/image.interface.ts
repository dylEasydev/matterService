import { 
    Model ,CreationOptional,InferAttributes, 
    InferCreationAttributes
} from 'sequelize';


export interface ImageInterface extends Model<
    InferAttributes<ImageInterface>,
    InferCreationAttributes<ImageInterface>
>{
    id:CreationOptional<number>;
    picturesName:CreationOptional<string>;
    urlPictures:CreationOptional<string>;
    nameTable:CreationOptional<string>;

    foreignId:CreationOptional<number>;

    readonly createdAt:CreationOptional<Date>;
    readonly updatedAt:CreationOptional<Date>;
    readonly deletedAt:CreationOptional<Date>;
}