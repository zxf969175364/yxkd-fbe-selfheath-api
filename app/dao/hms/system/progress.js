/**
 * Created by hgs on 2016/8/17.
 */


export default {

    /**
     * 添加进度
     * @param data
     */
    create: async function (data) {
        'use strict';
        return D.model('progress').create(data).toPromise();
    },

    findOne: async function (data) {
        'use strict';
        return D.model('progress').findOne(data).toPromise();
    },

    /**
     * 计算数量
     * @param query
     */
    count: async function(query){
        'use strict';
        return D.model('progress').count(query).toPromise();
    },

    findByQuery: async function (query, paginates, orderby) {
        'use strict';
        return D.model('progress').find(query).paginate(paginates).sort(orderby).toPromise();
    },

    update: async function (query, data) {
        'use strict';
        // console.log('-----')
        // console.log(data)
        // console.log('-----')
        
        return D.model('progress').update(query,data);
    },

    find: async function(query){
        'use strict';
        return D.model('progress').find(query).toPromise();
    },

    findWithLogic : async function(query, logic){
        'use strict';
        return D.model('progress').find(query).where(logic);
    }

}