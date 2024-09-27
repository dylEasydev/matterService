import { MatterInterface } from '../interface';
import { FollowMatter ,Image , Matter ,sequelizedb1 ,sequelizedb2} from '../../db';
import { FollowMatterServiceInterface } from './interface';
import { Op } from 'sequelize';

class FollowMatterService implements FollowMatterServiceInterface{
    
    findMatterFollow(userId: number, limit?: number | undefined ,search='' ){
        return new Promise<{ count: number; rows: MatterInterface[]; }>(async (resolve, reject)=>{
            try {
                const tableMatter = await sequelizedb2.transaction(async t=>{
                    const tableFollow = await FollowMatter.findAndCountAll({
                        where:{
                            userId,
                            '$matter.subjectName$':{
                                [Op.like]:{
                                    [Op.any]:search?search.split('').map(chaine=>`%${chaine}%`):['']
                                }
                            }
                        },
                        limit,
                        include:[
                            {
                                association:FollowMatter.associations.matter,
                                attributes:{
                                    include:[
                                        [
                                            sequelizedb2.literal(
                                                sequelizedb2.getDialect() !== 'postgres'?
                                                `(
                                                    SELECT COUNT(*) from followMatter as fm
                                                    WHERE 
                                                        fm.subjectId= matter.id
                                                )`:`(
                                                    SELECT COUNT(*) FROM "followMatter"
                                                    WHERE 
                                                        "subjectId" = "matter"."id"
                                                )`
                                            )
                                            ,`nbreSubcribes`
                                        ]
                                    ]
                                }
                            }
                        ]
                    });
                    let tableMatter = tableFollow.rows.map(value=>{
                        return value.matter as MatterInterface;
                    });
                    tableMatter = await sequelizedb1.transaction(async t=>{
                        return await Promise.all(tableMatter.map(async elts=>{
                            const picture = await Image.findOne({
                                where:{
                                    foreignId:elts.id,
                                    nameTable:Matter.tableName
                                },
                                transaction:t
                            });
                            elts.image = picture?.urlPictures;
                            return {...elts.dataValues, image: elts.image} as Matter;
                        }));
                    });
                    return {count:tableFollow.count, rows:tableMatter};
                });
                resolve(tableMatter);
            } catch (error) {
                reject(error);
            }
        })
    }

    deSubscribeMatter(userId: number, subjectId: number){
        return new Promise<void>(async(resolve, reject) => {
            try {
                await sequelizedb2.transaction(async t=>{
                    await FollowMatter.destroy({
                        where:{
                            userId,
                            subjectId
                        },
                        force:true
                    });
                });
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    }   
}

export default new FollowMatterService();