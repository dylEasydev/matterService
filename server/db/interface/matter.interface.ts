import { 
    InferAttributes, InferCreationAttributes, Model,
    CreationOptional,CreateOptions, NonAttribute
} from 'sequelize';
import { ImageInterface } from './image.interface';
import { Domain } from './domain.interface';
import { User } from './user.interface';

export interface MatterInterface extends Model<
    InferAttributes<MatterInterface>,
    InferCreationAttributes<MatterInterface>
>{
    id:CreationOptional<number>;
    subjectName:string;
    subjectDescript:CreationOptional<string>;

    image?:NonAttribute<string>;
    
    domainId:NonAttribute<Domain['id']>;
    userId:NonAttribute<User['id']>;

    createImage(
        value?:{urlPictures?:string; picturesName?:string},
        options?:CreateOptions<InferAttributes<ImageInterface>>
    ):Promise<ImageInterface>;

    readonly createdAt:CreationOptional<Date>;
    readonly updatedAt:CreationOptional<Date>;
    readonly deletedAt:CreationOptional<Date>;
}