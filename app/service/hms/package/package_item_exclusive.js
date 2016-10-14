/**
 * Created by ZXF on 2016/8/12.
 */
import exclusiveDao from '../../../dao/hms/package/package_item_exclusive'

export default {
    /**
     * 新增互斥项目
     * @param data
     * @returns {data}
     */
    addExclusive: async function (data) {
        'use strict';
        return exclusiveDao.create(data);
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
        return exclusiveDao.findByQuery(query,paginates,orderby)
    },
    /**
     * 计算数量
     * @param query
     */
    count : async function(query){
        'use strict';
        return exclusiveDao.count(query)
    },
    /**
     * 根据条件查询单个
     * @param query
     */
    findOne : async function(query){
        'use strict';
        query['isDelete'] = query['isDelete'] || false;
        return exclusiveDao.findOne(query)
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
        return exclusiveDao.update(query,data,option)
    }
}