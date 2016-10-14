/**
 * Created by ZXF.
 */

export default {

    /**
     * 新增套餐
     * @param QAnswer
     */
    create: async function (dataLog) {
        'use strict';
        return D.model('package_item').create(dataLog).toPromise();
    },

    /**
     * 根据条件查询套餐
     * @param query
     * @param paginates
     * @param orderby
     */
    findByQuery: async function (query, paginates, orderby) {
        'use strict';
        return D.model('package_item').find(query).paginate(paginates).sort(orderby).toPromise();

    },
    /**
     * 计算数量
     * @param query
     */
    count: async function (query) {
        'use strict';
        return D.model('package_item').count(query).toPromise()
    },
    /**
     * 查询单条数据
     * @param query
     */
    findOne: async function (query) {
        'use strict';
        return D.model('package_item').findOne(query)
    },

    /**
     * 查询数据
     * @param query
     */
    find: async function (query) {
        'use strict';
        return D.model('package_item').find(query)
    },

    /**
     * 更新
     * @param query
     * @param data
     * @param option
     */
    update: async function (query, data, option) {
        'use strict';
        return D.model('package_item').update(query, data, option).toPromise()
    }



}