/**
 * Created by zjp on 16/9/8.
 */

export default {
    create:async function(data){
        'use strict';
        return D.model('package_rule').create(data).toPromise();
    },

    update: async function(query, data){
        'use strict';
        return D.model('package_rule').update(query, data).toPromise();
    },

    delete: async function(query){
        'use strict';
        let data = {isDelete: true};
        return D.model('package_rule').update(query, data).toPromise();
    },

    find: async function(query){
        'use strict';
        return D.model('package_rule').find(query).toPromise();

    },

    findOne:async function(query) {
        'use strict';
        query.isDelete = query.isDelete || false;
        return D.model('package_rule').findOne(query).toPromise();
    },

    count: async function(query) {
        'use strict';
        return D.model('package_rule').count(query).toPromise();
    },

    findByQuery: async function(query, paginates, orderby) {
        return D.model('package_rule').find(query).paginate(paginates).sort(orderby).toPromise();
    }
}