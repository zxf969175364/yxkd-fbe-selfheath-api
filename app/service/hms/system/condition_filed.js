/*
 * @Author: hgs 
 * @Date: 2016-09-13 18:10:02 
 * @Last Modified by: hgs
 * @Last Modified time: 2016-09-14 10:46:20
 */

import condiFileDao from '../../../dao/hms/system/condition_filed'

export default {

    /**
     * 新增客户信息
     * @param data
     * @returns   {data}
     */
    create: async function (data) {
        'use strict'

        return condiFileDao.create(data)

    },

    /**
     * 根据条件查询单个
     * @param query
     */
    findOne: async function (query) {
        'use strict'
        query['isDelete'] = query['isDelete'] || false
        return condiFileDao.findOne(query)
    },

    /**
     * 根据条件查询单个
     * @param query
     */
    find: async function (query) {
        'use strict'
        query['isDelete'] = query['isDelete'] || false
        return condiFileDao.find(query)
    },




}
