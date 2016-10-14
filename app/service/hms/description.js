/**
 * Created by zjp on 16/7/20.
 */

import descDao from '../../dao/hms/basic/description'
import Const from '../../utils/const/description_const'

export default {


    addDescription: async function(questions){
        return descDao.create(questions)
    },

    /**
     * 根据条件查询
     * @param query
     * @param paginates
     * @param orderby
     */
    findByQuery : async function(query,paginates,orderby){
        "use strict";
        query['isDelete'] = query['isDelete'] || false;
        return descDao.findByQuery(query,paginates,orderby)
    },
    /**
     * 计算数量
     * @param query
     */
    count : async function(query){
        "use strict";
        return descDao.count(query)
    },
    /**
     * 根据条件查询单个
     * @param query
     */
    findOne : async function(query){
        "use strict";
        query['isDelete'] = query['isDelete'] || false;
        return descDao.findOne(query)
    },
    /**
     * 删除题目
     * @param questionId
     */
    remove : async function(questionId){
        "use strict";
        let result = await descDao.findOne({id: questionId, isDelete: false});
        if(!result){
            throw new Error(Const.WORD_NOT_EXIST);
        }else{
            return descDao.remove(questionId)
        }
    },

    update: async function(query, data){
        'use strict';
        query.isDelete = false;
        let result = await descDao.findOne(query);
        if (!result){
            throw new Error(Const.WORD_NOT_EXIST);
        } else{
            return descDao.update(query, data);
        }
    }

}