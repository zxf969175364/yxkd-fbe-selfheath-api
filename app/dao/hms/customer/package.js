/**
 * Created by zjp on 16/9/8.
 */

export default {
    create:async function(data){
        'use strict';
        return D.model('package').create(data).toPromise();
    },

    find: async function(query) {
        'use strict';
        return D.model('package').find(query).toPromise();
    },
    findOne: async function(query) {
        'use strict';
        return D.model('package').findOne(query).toPromise();
    },
    count:async function(query){
        'use strict';
        return D.model('package').count(query).toPromise();
    },
    findByQuery: async function(query, paginates, orderby){
        'use strict';
        return D.model('package').find(query).paginate(paginates).sort(orderby).toPromise();

    },



}