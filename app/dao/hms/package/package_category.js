/**
 * Created by ZXF.
 */

export default {

    /**
     * 新增套餐类别
     * @param dataLog
     */
    create : async function(dataLog){
        'use strict';
        return D.model('package_category').create(dataLog).toPromise();
    },
    
    /**
     * 根据条件查询套餐类别
     * @param query
     * @param paginates
     * @param orderby
     */
    findByQuery: async function(query, paginates, orderby){
        'use strict';
        return D.model('package_category').find(query).paginate(paginates).sort(orderby).toPromise();

    },
    /**
     * 根据条件查询套餐类别
     * @param query
     */
    find: async function(query){
        'use strict';
        return D.model('package_category').find(query).toPromise();

    },
    /**
     * 计算数量
     * @param query
     */
    count: async function(query){
        'use strict';
        return D.model('package_category').count(query).toPromise()
    },
    /**
     * 查询单条数据
     * @param query
     */
    findOne: async function(query){
        'use strict';
        return D.model('package_category').findOne(query)
    },
    /**
     * 更新
     * @param query
     * @param data
     * @param option
     */
    update:async function(query,data,option){
        'use strict';
        return D.model('package_category').update(query,data,option).toPromise()
    }



}