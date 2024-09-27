import { 
    InferAttributes, InferCreationAttributes,Model,
    CreationOptional,NonAttribute,CreateOptions
} from 'sequelize';
import { MatterInterface ,Domain , User , ImageInterface } from '../interface';
import { Image } from '../models'

export class Matter extends Model<
    InferAttributes<Matter>,
    InferCreationAttributes<Matter>
>implements MatterInterface{

    declare id:CreationOptional<number>;
    declare subjectName:string;
    declare subjectDescript:CreationOptional<string>;

    declare image?:NonAttribute<string>;
    
    declare domainId:Domain['id'];
    declare userId:User['id'];

    declare readonly createdAt:CreationOptional<Date>;
    declare readonly updatedAt:CreationOptional<Date>;
    declare readonly deletedAt:CreationOptional<Date|null>;

    createImage(
        value?:{urlPictures?:string; picturesName?:string},
        options?:CreateOptions<InferAttributes<ImageInterface>>
    ){
        return new Promise<ImageInterface>(async (resolve, reject) => {
            try {
                const image = await Image.create({
                    foreignId:this.id,
                    nameTable:Matter.tableName,
                    urlPictures:value?.urlPictures,
                    picturesName:value?.picturesName
                },options);
                resolve(image);
            } catch (error) {
                reject(error);
            }
        })
    }
}