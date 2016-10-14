/**
 * Created by zhaojinpeng on 2016/6/20 0020.
 */

import roleDao from '../../../dao/hms/auth/role'
import CONST from '../../../utils/const/role_const'

export  default{
    create: async function (data) {
        'use strict';
        return roleDao.create(data);
    },

    update: async function (query, data) {
        'use strict';
        let exist = await roleDao.find(query);
        if (!!exist) {
            return roleDao.update(query,data);
        } else {
            throw new Error(CONST.ROLE_NOT_EXIST);
        }
    },

    addAccessRole: async function (data) {
        'use strict';
        let query = {roleName: data.roleName};
        let result = await roleDao.findOne(query);
        if (!!result) {
            throw new Error(CONST.ROLE_EXIST)
        } else {
            return roleDao.create(data);
        }
    },

    findOne: async function (query) {
        "use strict";
        query['isDelete'] = query['isDelete'] || false;
        return roleDao.findOne(query)
    },
    /**
     * 计算数量
     * @param query
     */
    count: async function (query) {
        "use strict";
        return roleDao.count(query)
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
        return roleDao.findByQuery(query, paginates, orderby)
    },

    find: async function (query) {
        'use strict';
        return roleDao.find(query);
    },

    del: async function (query) {
        'use strict';
        let updateData = {isDelete: true};
        return  roleDao.update(query, updateData);

    },

    delMutil: async function(idArray, userSession){
        'use strict';
        let query = {id:idArray, isPreset:false};
        switch (userSession.roleType){
            case "AGENCY":
                query.agencyId = userSession.orgId;
                break;
            case "HOSPITAL":
                query.hospitalId = userSession.orgId;
                break;
            case "CENTER":
                query.centerId = userSession.orgId;
                break;
        }
        let data = await roleDao.find(query);
        return roleDao.update(query, {isDelete:true})

    }


};