import { Matter, FollowMatter } from '../init';

FollowMatter.belongsTo(Matter,{
    foreignKey:{
        name:'subjectId',
        allowNull:false
    },
    targetKey:'id',
    hooks:true,
    onDelete:'CASCADE',
    as:'matter'
})

export {FollowMatter};