/**
 * Created by G on 2016/6/17 0017.
 */

export default {

    /**
     * 添加组织
     * @param data
     */
    addOrg: async function (data) {
        'use strict';
        return D.model('organizations').create(data).toPromise();
    },
    
    findOne: async function (data) {
        'use strict';
        return D.model('organizations').findOne(data).toPromise();
    },

    /** 
     * 计算数量
     * @param query
     */
    count: async function(query){
        'use strict';
        return D.model('organizations').count(query).toPromise();
    },
    
    findByQuery: async function (query, paginates, orderby) {
        'use strict';
        return D.model('organizations').find(query).paginate(paginates).sort(orderby).toPromise();
    },

    update: async function(query, data){
        'use strict';
        return D.model('organizations').update(query,data).toPromise();
    },

    find: async function(query){
        'use strict';
        return D.model('organizations').find(query).toPromise();
    }
    
}