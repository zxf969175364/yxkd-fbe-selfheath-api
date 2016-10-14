/**
 * Created by ZXF on 2016/8/12.
 */
import categoryDao from '../../../dao/hms/package/package_category'

export default {
    /**
     * 新增项目类别
     * @param data
     * @returns {data}
     */
    addCategory: async function (data) {
        'use strict';
        return categoryDao.create(data);
    },

    /**
     * 根据条件查询
     * @param query
     * @param paginates
     * @param orderby
     */
    findByQuery : async function(query,paginates,orderby){
        'use strict';
        query['isDelete'] = query['isDelete'] || false;
        return categoryDao.findByQuery(query,paginates,orderby)
    },
    /**
     * 根据条件查询
     * @param query
     */
    find : async function(query){
        'use strict';
        query['isDelete'] = query['isDelete'] || false;
        return categoryDao.find(query)
    },
    /**
     * 计算数量
     * @param query
     */
    count : async function(query){
        'use strict';
        return categoryDao.count(query)
    },
    /**
     * 根据条件查询单个
     * @param query
     */
    findOne : async function(query){
        'use strict';
        query['isDelete'] = query['isDelete'] || false;
        return categoryDao.findOne(query)
    },
    /**
     * 更新
     * @param query
     * @param data
     * @param option
     * @returns {*}
     */
    update: async function(query,data,option){
        'use strict';
        return categoryDao.update(query,data,option)
    }
}