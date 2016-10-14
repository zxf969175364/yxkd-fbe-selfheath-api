/*
 * @Author: hgs 
 * @Date: 2016-09-05 09:36:21 
 * @Last Modified by: hgs
 * @Last Modified time: 2016-09-26 11:24:42
 */


import indiciaDao from '../../../dao/hms/package/package_indicator'
import categDao from '../../../dao/hms/package/package_category'
import itemDao from '../../../dao/hms/package/package_item'
import indiciaConst from '../../../utils/const/indicator_const'


export default {
    /**
     * 新增指标
     * @param indicator
     * @returns {indicator}
     */

    addIndicator: async function (indicator, sess) {
        'use strict';
        try {
            let categQuery = {};
            categQuery.id = indicator.categoryId;
            let categData = await categDao.findOne(categQuery);
            if (!categData) {
                throw new Error(indiciaConst.NOT_EXIST_CATEGORY);
            } else {
                indicator['categoryName'] = categData.categoryName;

                if (indicator.itemId) {
                    let itemQuery = {};
                    itemQuery.id = indicator.itemId;
                    let itemData = await itemDao.findOne(itemQuery);
                    if (!itemData) {
                        throw new Error(indiciaConst.NOT_EXIST_ITEM)
                    } else {
                        indicator['inPackageName'] = indicator['indicator'] || itemData.itemName;
                        indicator['itemName'] = itemData.itemName;
                    }
                }
                indicator['nameCenter'] = indicator['nameCenter'] || indicator.name;

                console.error(indicator)

                // let indiciaData = await indiciaDao.create(indicator);
                // if (indiciaData) {
                //     // indiciaDao.update({ id: indiciaData.id }, { uqnumber: indiciaData.id });
                //     return indiciaData;
                // } else {
                //     return false;
                // }
                return indiciaDao.create(indicator);


            }

        } catch (error) {
            console.log(error)

        }


    },

    find: async function (query) {
        'use strict';
        query['isDelete'] = query['isDelete'] || false;
        return indiciaDao.find(query);
    },

    searchAndGroup: async function (query) {
        'use strict';
        let data = await indiciaDao.find(query);
        let tmpData = _.groupBy(data, (category) => {
            return category.categoryId
        })



        let resultArray = [];
        _.forEach(tmpData, (value, key) => {
            let tmpCategory = {};
            tmpCategory.categoryId = value[0].categoryId;
            tmpCategory.categoryName = value[0].categoryName;
            tmpCategory.items = []

            //按项目分组
            let tmp1 = _.groupBy(value, (item) => {
                return item.itemId;
            })
            console.log(tmp1);
            _.forEach(tmp1, (value, key) => {
                let tmpItem = {}
                tmpItem.itemId = value[0].itemId;
                tmpItem.itemName = value[0].itemName;
                tmpItem.isSplit = value[0].isSplit;
                tmpItem.indicators = [];
                // let tmp2 = _.groupBy(tmp2, (indicators) => {
                //     return indicators.id;
                // })
                _.forEach(value, (ins) => {
                    tmpItem.indicators.push(ins);
                })
                tmpCategory.items.push(tmpItem);
            })
            resultArray.push(tmpCategory);
        })






        // let tmpArray = [];
        // _.forEach(data, (tmpData) => {
        //     let tmp = _.find(tmpArray, (v) => {
        //         return tmpData.t
        //     })
        // })

        return resultArray
    },

    remove: async function (id) {
        "use strict";
        let result = await indiciaDao.findOne({ id: id, isDelete: false });
        if (!result) {
            throw new Error(indiciaConst.NOT_EXIST_INDICATOR)
        } else {
            return indiciaDao.remove(id)
        }
    },




    /**
     * 根据条件查询
     * @param query
     * @param paginates
     * @param orderby
     */
    findByQuery: async function (query, paginates, orderby) {
        'use strict';
        query['isDelete'] = query['isDelete'] || false;
        return indiciaDao.findByQuery(query, paginates, orderby)
    },
    /**
     * 计算数量
     * @param query
     */
    count: async function (query) {
        'use strict';
        return indiciaDao.count(query)
    },
    /**
     * 根据条件查询单个
     * @param query
     */
    findOne: async function (query) {
        'use strict';
        query['isDelete'] = query['isDelete'] || false;
        return indiciaDao.findOne(query)
    },
    /**
     * 更新(分科室与超管)
     * @param query
     * @param data
     * @param option
     * @returns {*}
     */
    updateIndica: async function (data, sess) {
        'use strict';
        let result;
        let oneIndicator = await indiciaDao.findOne({ id: data.id });
        if (!oneIndicator) {
            throw new Error(indiciaConst.NOT_EXIST_INDICATOR)
        }
        if (data.uqnumber && !_.isEmpty(data.uqnumber)) {
            let uqnumberData = await indiciaDao.findOne({
                uqnumber: data.uqnumber,
                id: { '!': data.id }
            });

            if (uqnumberData) {
                throw new Error(indiciaConst.UQNUMBER_REPEAT)
            }
        }


        if (sess.user.roleType === 'SUADMIN') {
            let adminUpdateData = {
                categoryId: data.categoryId,
                categoryName: data.categoryName,
                itemId: data.itemId,
                itemName: data.itemName,
                name: data.name,
                nameEn: data.nameEn,
                nameEnAbb: data.nameEnAbb
            }
            let adminQuery = { id: data.id };
            let centerQuery = { associateId: data.id }
            delete data.id;
            result = await indiciaDao.update(adminQuery, data);
            await indiciaDao.update(centerQuery, adminUpdateData);
        } else {
            let upQuery = { id: data.id }
            delete data.id;
            result = indiciaDao.update(upQuery, data);
            let itemsData = await indiciaDao.find({ itemId: data.itemId });
            console.log(itemsData)
            let totalPrice = 0;
            _.forEach(itemsData, (v) => {
                totalPrice += v.price;
            })
            await itemDao.update({ id: data.itemId }, { price: totalPrice });
        }

        return result;

    },

    /**
     * 更新
     * @param query
     * @param data
     * @param option
     * @returns {*}
     */
    updateAll: async function (query, data, option) {
        'use strict';
        return indiciaDao.update(query, data, option)
    },

    /**
     * 删除
     */
    del: async function (query) {
        'use strict';
        let updateData = { isDelete: true };
        return indiciaDao.update(query, updateData);
    },

}