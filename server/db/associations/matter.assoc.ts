import { Matter, FollowMatter } from '../init';

Matter.hasMany(FollowMatter,{
    foreignKey:{
        name:'subjectId',
        allowNull:false
    },
    sourceKey:'id',
    hooks:true,
    onDelete:'CASCADE',
    as:'follows'
});

export {Matter};