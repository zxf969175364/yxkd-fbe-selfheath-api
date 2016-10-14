/**
 * Created by zjp on 2016/7/5.
 */


export default {

    /**
     * 添加科室分配容量
     * @param data
     */
    create: async function (data) {
        'use strict';
        return D.model('capacity').create(data).toPromise();
    },

    findOne: async function (data) {
        'use strict';
        return D.model('capacity').findOne(data).toPromise();
    },

    /**
     * 计算数量
     * @param query
     */
    count: async function (query) {
        'use strict';
        return D.model('capacity').count(query).toPromise();
    },

    /**
     * 根据条件查询
     * @param query
     * @param paginates
     * @param orderby
     */
    findByQuery: async function (query, paginates, orderby) {
        'use strict';
        return D.model('capacity').find(query).paginate(paginates).sort(orderby).toPromise();
    },

    update: async function (query, data) {
        'use strict';
        return D.model('capacity').update(query, data).toPromise();
    },



    findWithGroupBy: async function (query, groupFiled, countFiled) {
        'use strict';
        return D.model('capacity').find(query).groupBy(groupFiled).sum(countFiled);
    },
    
    findWithGroupAndSortBy: async function (query, groupFiled, countFiled, orderby) {
        'use strict';
        return D.model('capacity').find(query).groupBy(groupFiled).sum(countFiled).sort(orderby);
    },



    find: async function (query) {
        'use strict';
        return D.model('capacity').find(query).toPromise();
    }, 


}