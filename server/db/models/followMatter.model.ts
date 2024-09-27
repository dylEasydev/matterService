import { 
    InferAttributes, InferCreationAttributes, Model,
    CreationOptional , ForeignKey,Association,NonAttribute
} from 'sequelize';
import { FollowMatterInterface,User,MatterInterface } from '../interface';

export class FollowMatter extends Model<
    InferAttributes<FollowMatter>,
    InferCreationAttributes<FollowMatter>
>implements FollowMatterInterface{
    declare id:CreationOptional<number>;

    declare subjectId:ForeignKey<number>;
    declare userId:User['id'];

    declare readonly createdAt:CreationOptional<Date>;
    declare readonly updatedAt:CreationOptional<Date>;
    declare readonly deletedAt:CreationOptional<Date>;

    declare matter?:NonAttribute<MatterInterface>;

    declare static associations:{
        matter:Association<FollowMatterInterface , MatterInterface>
    };
}