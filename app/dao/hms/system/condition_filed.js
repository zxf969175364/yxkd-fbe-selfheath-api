/*
 * @Author: hgs 
 * @Date: 2016-09-13 17:59:46 
 * @Last Modified by: hgs
 * @Last Modified time: 2016-09-13 18:00:07
 */
export default {

    /**
     * 添加条件
     * @param data
     */
    create: async function (data) {
        'use strict';
        return D.model('condition_filed').create(data).toPromise();
    },

    findOne: async function (data) {
        'use strict';
        return D.model('condition_filed').findOne(data).toPromise();
    },

    /**
     * 计算数量
     * @param query
     */
    count: async function(query){
        'use strict';
        return D.model('condition_filed').count(query).toPromise();
    },

    findByQuery: async function (query, paginates, orderby) {
        'use strict';
        return D.model('condition_filed').find(query).paginate(paginates).sort(orderby).toPromise();
    },

    update: async function (query, data) {
        'use strict';
        // console.log('-----')
        // console.log(data)
        // console.log('-----')
        
        return D.model('condition_filed').update(query,data);
    },

    find: async function(query){
        'use strict';
        return D.model('condition_filed').find(query).toPromise();
    }



}