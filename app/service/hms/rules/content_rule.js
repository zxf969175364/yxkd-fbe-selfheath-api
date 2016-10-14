/**
 * Created by zjp on 2016/7/5.
 */


import crDao from '../../../dao/hms/rules/content_rule'
import CONST from '../../../utils/const/rule_const'

export  default{
    create: async function (data) {
        'use strict';
        return crDao.create(data);
    },


    /**
     * 更新组织信息，需要批量更新下级组织中对应的组织名称。
     * @param query
     * @param data
     * @returns {*}
     */
    update: async function (query, data) {
        'use strict';
        let exist = await crDao.find(query);
        if (!!exist) {
            return crDao.update(query,data);
        } else {
            throw new Error(CONST.RULE_NOT_EXIST);
        }
    },



    findOne: async function (query) {
        "use strict";
        query['isDelete'] = query['isDelete'] || false;
        return crDao.findOne(query)
    },


    /**
     * 计算数量
     * @param query
     */
    count: async function (query) {
        "use strict";
        return crDao.count(query)
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
        return crDao.findByQuery(query, paginates, orderby)
    },

    find: async function (query) {
        'use strict';
        return crDao.find(query);
    },

    del: async function (query) {
        'use strict';
        let updateData = {isDelete: true};
        return  crDao.update(query, updateData);

    },

    findWithLogic: async function(query, logic){
        'use strict';
        if (logic.or || logic.and || logic.and){
            return crDao.find(query, logic);
        }else{
            throw new Error(CONST.LOGIC_ERROR);
        }
    }


};