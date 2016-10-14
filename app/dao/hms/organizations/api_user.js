/**
 * Created by zjp on 16/10/11.
 */
export default {
    create: async function(data){
        'use strict';
        return D.model('api_user').create(data).toPromise();
    },

    findOne: async function (data) {
        'use strict';
        return D.model('api_user').findOne(data).toPromise();
    },
};