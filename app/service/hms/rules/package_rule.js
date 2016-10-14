/**
 * Created by zjp on 16/9/8.
 */

import prDao from '../../../dao/hms/rules/package_rule';

export default {

    create: async function (data) {
        'use strict';
        data.isDelete = data.isDelete || false;
        return prDao.create(data);
    },

    delete: async function (query) {
        'use strict';
        return prDao.delete(query);
    },

    update: async function (query, data) {
        'use strict';
        return prDao.update(query, data);
    },

    find: async function(query){
        'use strict';
        return prDao.find(query);
    },

    findOne: async function(query) {
        'use strict';
        return prDao.findOne(query);
    },

    count: async function(query){
        'use strict';
        return prDao.count(query);
    },

    findByQuery: async function(query, paginates, orderby){
        return  prDao.findByQuery(query, paginates, orderby);
    }
}