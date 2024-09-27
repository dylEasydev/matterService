import { Op } from 'sequelize';
import { 
    Matter , sequelizedb2 , Domain ,sequelizedb1,Image,FollowMatter
} from '../../db';
import { MatterInterfaceService } from './interface';
import { FollowMatterInterface, MatterInterface } from '../interface';
import { __urlImage } from '../../global_dir';

class MatterService implements MatterInterfaceService{
    createMatter<
        T extends { subjectName: string; subjectDescript?: string; }
    >(value: T, domain: Domain, userId: number){
        return new Promise<Matter>(async(resolve, reject) => {
            try {
                const newMatter  = await sequelizedb2.transaction(async t=>{
                    const matter = await Matter.create({
                        subjectName:value.subjectName,
                        subjectDescript:value.subjectDescript,
                        userId,
                        domainId: domain.id
                    },{transaction:t});
                    matter.image = await sequelizedb1.transaction(async t1=>{
                        const picture = await matter.createImage({
                            urlPictures:`${__urlImage}/public/matter_default.jpeg`,
                            picturesName:'matter_default.jpeg'
                        },{transaction:t1});
                        return picture.urlPictures;
                    }); 
                    return matter;
                });
                resolve(newMatter);
            } catch (error) {
                reject(error);
            }
        })
    }
    
    findMatterByName(name: string){
        return new Promise<Matter|null>(async (resolve, reject) => {
            try {
                const matterFind = await sequelizedb2.transaction(async t=>{
                    return await Matter.findOne({
                        where:{
                            subjectName:name
                        },
                        attributes:{
                            include:[
                                [
                                    sequelizedb2.literal(
                                        sequelizedb2.getDialect() !== 'postgres'?
                                        `(
                                            SELECT COUNT(*) from followMatter as fm
                                            WHERE 
                                                fm.subjectId = matter.id
                                        )`:`(
                                            SELECT COUNT(*) FROM "followMatter"
                                            WHERE 
                                                "subjectId" = "Matter"."id"
                                        )`
                                    )
                                    ,`nbreSubcribes`
                                ]
                            ]
                        }
                    });
                });
                if(matterFind !== null){
                    matterFind.image = await sequelizedb1.transaction(async t=>{
                        const pictures = await Image.findOne({
                            where:{
                                foreignId: matterFind.id,
                                nameTable:Matter.tableName
                            }
                        })
                        return pictures?.urlPictures;
                    });
                    resolve({...matterFind.dataValues ,image:matterFind.image} as Matter);
                }else resolve(matterFind);
            } catch (error) {
                reject(error);
            }
        })
    }

    findMatterById(id: number){
        return new Promise<Matter|null>(async (resolve, reject) => {
            try {
                const matterFind = await sequelizedb2.transaction(async t=>{
                    return await Matter.findByPk(id,{
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
                                                "subjectId" = "Matter"."id"
                                        )`
                                    )
                                    ,`nbreSubcribes`
                                ]
                            ]
                        }
                    });
                });
                if(matterFind !== null){
                    matterFind.image = await sequelizedb1.transaction(async t=>{
                        const pictures = await Image.findOne({
                            where:{
                                foreignId: matterFind.id,
                                nameTable:Matter.tableName
                            }
                        });
                        return pictures?.urlPictures;
                    });
                    resolve({...matterFind.dataValues ,image:matterFind.image} as Matter);
                }else resolve(matterFind);
            } catch (error) {
                reject(error);
            }
        })
    }

    findAllMatter(limit?: number, search=''){
        return new Promise<{
             rows: Matter[]; count: number; 
        }>(async (resolve, reject)=>{
            try {
                const tableMatter = await sequelizedb2.transaction(async t=>{
                    return await Matter.findAndCountAll({
                        where:{
                            subjectName:{
                                [Op.like]:{
                                    [Op.any]:search?search.split('').map(chaine=>`%${chaine}%`):['']
                                }
                            }
                        },
                        limit,
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
                                                "subjectId" = "Matter"."id"
                                        )`
                                    )
                                    ,`nbreSubcribes`
                                ]
                            ]
                        },
                        order:[
                            [
                                sequelizedb2.getDialect() !== 'postgres'?
                                sequelizedb2.literal(`nbreSubscribes`):
                                sequelizedb2.literal(`"nbreSubscribes"`)
                                ,'DESC'
                            ]
                        ]
                    })
                });
                tableMatter.rows = await sequelizedb1.transaction(async t=>{
                    return await Promise.all(tableMatter.rows.map(async elts=>{
                        const picture = await Image.findOne({
                            where:{
                                foreignId:elts.id,
                                nameTable:Matter.tableName
                            },
                            transaction:t
                        });
                        elts.image = picture?.urlPictures;
                        return {...elts.dataValues, image: elts.image} as Matter;
                    }))
                })
                resolve(tableMatter);
            } catch (error) {
                reject(error);               
            }
        }) 
    }

    updateMatter<
        T extends { subjectName?: string; subjectDescript?: string ; }
    >(instance: MatterInterface, value: T){
        return new Promise<Matter>(async(resolve, reject) => {
            try {
                const matterUpdate = await sequelizedb2.transaction(async t=>{
                    return await instance.update(value);
                })
                resolve(matterUpdate);
            } catch (error) {
                reject(error)
            }
        })
    }

    followMatter(instance: MatterInterface, userId: number){
        return new Promise<[FollowMatterInterface , boolean]>(async(resolve, reject) => {
            try {
                const followMatter = await sequelizedb2.transaction(async t=>{
                    return await FollowMatter.findOrCreate({
                        where:{
                            userId,
                            subjectId:instance.id
                        },
                        defaults:{
                            userId,
                            subjectId:instance.id
                        }
                    })
                });
                resolve(followMatter);
            } catch (error) {
                reject(error);
            }
        })
    }

    deleteMatter(instance: MatterInterface){
        return new Promise<void>(async(resolve, reject) => {
            try {
                await sequelizedb2.transaction(async t=>{
                    await Matter.destroy({where:{id:instance.id},force:true});
                })
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    }

    suspendMatter(instance: MatterInterface){
        return new Promise<void>(async(resolve, reject) => {
            try {
                await sequelizedb2.transaction(async t=>{
                    await Matter.destroy({where:{id:instance.id}});
                })
                resolve();
            } catch (error) {
                reject(error);
            }
        })       
    }

    restoreMatter(id: number){
        return new Promise<Matter | null>(async (resolve, reject) => {
            try {
                const matterRestore = await sequelizedb2.transaction(async t=>{
                    const matterFind = await Matter.findByPk(id,{
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
                                                "subjectId" = "Matter"."id"
                                        )`
                                    )
                                    ,`nbreSubcribes`
                                ]
                            ]
                        },
                        paranoid:false
                    })
                    if(matterFind !== null){
                        await matterFind.restore();
                        matterFind.image = await sequelizedb1.transaction(async t=>{
                            const pictures = await Image.findOne({
                                where:{
                                    foreignId: matterFind.id,
                                    nameTable:Matter.tableName
                                }
                            });
                            return pictures?.urlPictures;
                        });
                        return {...matterFind.dataValues ,image:matterFind.image} as Matter ;
                    }else return matterFind;
                })
                resolve(matterRestore);
            } catch (error) {
                reject(error);
            }
        })
    }

    findAllMatterSuspend(limit?: number, search=''){
        return new Promise<{
             rows: Matter[]; count: number; 
        }>(async (resolve, reject)=>{
            try {
                const tableMatter = await sequelizedb2.transaction(async t=>{
                    return await Matter.findAndCountAll({
                        where:{
                            [Op.and]:[
                                {
                                    subjectName:{
                                        [Op.like]:{
                                            [Op.any]:search?search.split('').map(chaine=>`%${chaine}%`):['']
                                        }
                                    }
                                },
                                {
                                    deletedAt:{
                                        [Op.not]:null
                                    }
                                }
                            ]
                        },
                        limit,
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
                                                "subjectId" = "Matter"."id"
                                        )`
                                    )
                                    ,`nbreSubcribes`
                                ]
                            ]
                        },
                        paranoid:false,
                        order:[
                            [
                                sequelizedb2.getDialect() !== 'postgres'?
                                sequelizedb2.literal(`nbreSubscribes`):
                                sequelizedb2.literal(`"nbreSubscribes"`)
                                ,'DESC'
                            ]
                        ]
                    })
                });
                tableMatter.rows = await sequelizedb1.transaction(async t=>{
                    return await Promise.all(tableMatter.rows.map(async elts=>{
                        const picture = await Image.findOne({
                            where:{
                                foreignId:elts.id,
                                nameTable:Matter.tableName
                            },
                            transaction:t
                        });
                        elts.image = picture?.urlPictures;
                        return {...elts.dataValues, image: elts.image} as Matter;
                    }))
                })
                resolve(tableMatter);
            } catch (error) {
                reject(error);               
            }
        }) 
    }

    findAllMatterDomain(domainId:number,limit?: number, search=''){
        return new Promise<{
             rows: Matter[]; count: number; 
        }>(async (resolve, reject)=>{
            try {
                const tableMatter = await sequelizedb2.transaction(async t=>{
                    return await Matter.findAndCountAll({
                        where:{
                            [Op.and]:[
                                {
                                    subjectName:{
                                        [Op.like]:{
                                            [Op.any]:search?search.split('').map(chaine=>`%${chaine}`):['']
                                        }
                                    }
                                },
                                {
                                    domainId
                                }
                            ]
                        },
                        limit,
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
                                                "subjectId" = "Matter"."id"
                                        )`
                                    )
                                    ,`nbreSubcribes`
                                ]
                            ]
                        },
                        order:[
                            [
                                sequelizedb2.getDialect() !== 'postgres'?
                                sequelizedb2.literal(`nbreSubscribes`):
                                sequelizedb2.literal(`"nbreSubscribes"`)
                                ,'DESC'
                            ]
                        ]
                    })
                });
                tableMatter.rows = await sequelizedb1.transaction(async t=>{
                    return await Promise.all(tableMatter.rows.map(async elts=>{
                        const picture = await Image.findOne({
                            where:{
                                foreignId:elts.id,
                                nameTable:Matter.tableName
                            },
                            transaction:t
                        });
                        elts.image = picture?.urlPictures;
                        return {...elts.dataValues, image: elts.image} as Matter;
                    }))
                })
                resolve(tableMatter);
            } catch (error) {
                reject(error);               
            }
        }) 
    }

    findAllMatterTeacher(userId:number,limit?: number, search=''){
        return new Promise<{
             rows: Matter[]; count: number; 
        }>(async (resolve, reject)=>{
            try {
                const tableMatter = await sequelizedb2.transaction(async t=>{
                    return await Matter.findAndCountAll({
                        where:{
                            [Op.and]:[
                                {
                                    subjectName:{
                                        [Op.like]:{
                                            [Op.any]:search?search.split('').map(chaine=>`%${chaine}`):['']
                                        }
                                    }
                                },
                                {
                                    userId
                                }
                            ]
                        },
                        limit,
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
                                                "subjectId" = "Matter"."id"
                                        )`
                                    )
                                    ,`nbreSubcribes`
                                ]
                            ]
                        },
                        order:[
                            [
                                sequelizedb2.getDialect() !== 'postgres'?
                                sequelizedb2.literal(`nbreSubscribes`):
                                sequelizedb2.literal(`"nbreSubscribes"`)
                                ,'DESC'
                            ]
                        ]
                    })
                });
                tableMatter.rows = await sequelizedb1.transaction(async t=>{
                    return await Promise.all(tableMatter.rows.map(async elts=>{
                        const picture = await Image.findOne({
                            where:{
                                foreignId:elts.id,
                                nameTable:Matter.tableName
                            },
                            transaction:t
                        });
                        elts.image = picture?.urlPictures;
                        return {...elts.dataValues, image: elts.image} as Matter;
                    }))
                })
                resolve(tableMatter);
            } catch (error) {
                reject(error);               
            }
        }) 
    }
}

export default new MatterService();