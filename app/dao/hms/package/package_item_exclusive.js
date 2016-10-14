/**
 * Created by ZXF.
 */

export default {

    /**
     * 新增互斥项目
     * @param QAnswer
     */
    create : async function(dataLog){
        'use strict';
        return D.model('package_item_exclusive').create(dataLog).toPromise();
    },
    
    /**
     * 根据条件查询互斥项目
     * @param query
     * @param paginates
     * @param orderby
     */
    findByQuery: async function(query, paginates, orderby){
        'use strict';
        return D.model('package_item_exclusive').find(query).paginate(paginates).sort(orderby).toPromise();

    },
    /**
     * 计算数量
     * @param query
     */
    count: async function(query){
        'use strict';
        return D.model('package_item_exclusive').count(query).toPromise()
    },
    /**
     * 查询单条数据
     * @param query
     */
    findOne: async function(query){
        'use strict';
        return D.model('package_item_exclusive').findOne(query)
    },
    /**
     * 更新
     * @param query
     * @param data
     * @param option
     */
    update:async function(query,data,option){
        'use strict';
        return D.model('package_item_exclusive').update(query,data,option).toPromise()
    }



}