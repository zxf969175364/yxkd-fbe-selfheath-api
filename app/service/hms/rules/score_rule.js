/**
 * Created by zjp on 2016/7/5.
 */

import srDao from '../../../dao/hms/rules/score_rule';
import CONST from '../../../utils/const/rule_const'

export  default{
    create: async function (data) {
        'use strict';
        return srDao.create(data);
    },


    /**
     * 更新组织信息，需要批量更新下级组织中对应的组织名称。
     * @param query
     * @param data
     * @returns {*}
     */
    update: async function (query, data) {
        'use strict';
        let exist = await srDao.find(query);
        if (!!exist) {
            return srDao.update(query, data);
        } else {
            throw new Error(CONST.RULE_NOT_EXIST);
        }
    },


    findOne: async function (query) {
        "use strict";
        // query['isDelete'] = query['isDelete'] || false;
        return srDao.findOne(query)
    },


    /**
     * 计算数量
     * @param query
     */
    count: async function (query) {
        "use strict";
        return srDao.count(query)
    },

    /**
     * 根据条件查询
     * @param query
     * @param paginates
     * @param orderby
     */
    findByQuery: async function (query, paginates, orderby) {
        "use strict";
        // query['isDelete'] = query['isDelete'] || false;
        return srDao.findByQuery(query, paginates, orderby)
    },

    find: async function (query) {
        'use strict';
        return srDao.find(query);
    },

    del: async function (query) {
        'use strict';
        let updateData = {isDelete: true};
        return srDao.update(query, updateData);

    },

    findWithLogic: async function(query, logic){
        'use strict';
        if (logic.or || logic.and || logic.and){
            return srDao.find(query,logic);
        }else{
            throw new Error(CONST.LOGIC_ERROR);
        }
    },

    getAllRulesName : async function(questionnaireId){
        'use strict';
        let rules = await this.find({questionnaireId: questionnaireId, isDelete: false});
        console.log(rules);
        let names = [];
        _.forEach(rules, function (r) {
            names.push(r.section);
        })
        return names;
    }



};