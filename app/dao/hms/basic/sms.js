/**
 * Created by zjp on 16/8/17.
 */


export default {

    /**
     * 添加短信记录
     * @param data
     */
    create: async function (data) {
        'use strict';
        return D.model('sms').create(data).toPromise();
    },
    // update: async function (query, data) {
    //     'use strict';
    //     return D.model('sms').update(query, data).toPromise();
    // },

    find: async function (query) {
        return D.model('sms').find(query).toPromise();
    },
    findGroupByMax: async function (query, groupBy, max) {
        return D.model('sms').find(query).groupBy(groupBy).max(max).toPromise();
    }
}