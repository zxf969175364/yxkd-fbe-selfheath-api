/**
 * Created by zhaojinpeng on 2016/6/20 0020.
 */

import roleTypeDao from '../../../dao/hms/auth/role_type'
import CONST from '../../../utils/const/role_const'

export  default{
    create: async function (data) {
        'use strict';
        return roleTypeDao.create(data);
    },

    update: async function (query, data) {
        'use strict';
        let exist = await roleTypeDao.find(query);
        if (!!exist) {
            return roleTypeDao.update(query,data);
        } else {
            throw new Error(CONST.ROLE_NOT_EXIST);
        }
    },


    findOne: async function (query) {
        "use strict";
        query['isDelete'] = query['isDelete'] || false;
        return roleTypeDao.findOne(query)
    },
    /**
     * 计算数量
     * @param query
     */
    count: async function (query) {
        "use strict";
        return roleTypeDao.count(query)
    },

    /**
     * 根据条件查询
     * @param query
     * @param paginates
     * @param orderby
     */
    findByQuery: async function (query, paginates, orderby) {
        "use strict";
        query['isDelete'] = query['isDelete'] || false;
        return roleTypeDao.findByQuery(query, paginates, orderby)
    },

    find: async function (query) {
        'use strict';
        return roleTypeDao.find(query);
    },

    del: async function (query) {
        'use strict';
        let updateData = {isDelete: true};
        return  roleTypeDao.update(query, updateData);

    }


};