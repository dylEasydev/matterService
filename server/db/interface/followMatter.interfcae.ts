import {
    CreationOptional, ForeignKey, InferAttributes,
    InferCreationAttributes, Model, NonAttribute
} from 'sequelize';
import { User } from './user.interface';
import { MatterInterface } from './matter.interface';

export interface FollowMatterInterface extends Model<
    InferAttributes<FollowMatterInterface>,
    InferCreationAttributes<FollowMatterInterface>
>{
    id:CreationOptional<number>;

    subjectId:ForeignKey<number>;
    userId:User['id'];

    matter?:NonAttribute<MatterInterface>;

    readonly createdAt:CreationOptional<Date>;
    readonly updatedAt:CreationOptional<Date>;
    readonly deletedAt:CreationOptional<Date>;
}