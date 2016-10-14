/**
 * Created by G on 2016/6/17 0017.
 */

export default {

    /**
     * 添加组织
     * @param data
     */
    create: async function (data) {
        'use strict';
        return D.model('customers').create(data).toPromise();
    },

    findOne: async function (data) {
        'use strict';
        return D.model('customers').findOne(data).toPromise();
    },

    findOrCreate: async function (search, data) {
        'use strict';
        return D.model('customers').findOrCreate(search, data)  
    },
    
    /**
     * 计算数量
     * @param query
     */
    count: async function(query){
        'use strict';
        return D.model('customers').count(query).toPromise();
    },

    findByQuery: async function (query, paginates, orderby) {
        'use strict';
        return D.model('customers').find(query).paginate(paginates).sort(orderby).toPromise();
    },

    update: async function(query, data){
        'use strict';
        return D.model('customers').update(query,data).toPromise();
    },

    find: async function(query){
        'use strict';
        return D.model('customers').find(query).toPromise();
    }

}