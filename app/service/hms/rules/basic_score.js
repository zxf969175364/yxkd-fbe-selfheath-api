/**
 * Created by zjp on 16/8/20.
 */

import bsDao from '../../../dao/hms/basic/basic_score'

export default {

    create:async function(data){
        'use strict';
        return bsDao.create(data);
    },

    find: async function(query){
        'use strict';
        return bsDao.find(query);
    },

    findOne: async function(query){
        'use strict';
        return bsDao.findOne(query);
    }


}