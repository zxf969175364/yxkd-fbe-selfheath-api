/**
 * Created by zjp on 2016/7/5.
 */


export default {

    /**
     * 添加组织
     * @param data
     */
    create: async function (data) {
        'use strict';
        return D.model('score_rule').create(data).toPromise();
    },

    findOne: async function (data) {
        'use strict';
        return D.model('score_rule').findOne(data).toPromise();
    },

    /**
     * 计算数量
     * @param query
     */
    count: async function(query){
        'use strict';
        return D.model('score_rule').count(query).toPromise();
    },

    findByQuery: async function (query, paginates, orderby) {
        'use strict';
        return D.model('score_rule').find(query).paginate(paginates).sort(orderby).toPromise();
    },

    update: async function(query, data){
        'use strict';
        return D.model('score_rule').update(query,data).toPromise();
    },

    find: async function(query){
        'use strict';
        return D.model('score_rule').find(query).toPromise();
    },

    findWithLogic : async function(query, logic){
        'use strict';
        return D.model('score_rule').find(query).where(logic);
    }

}