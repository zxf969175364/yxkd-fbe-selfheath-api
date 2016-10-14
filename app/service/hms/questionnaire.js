/**
 * Created by huangjun on 16/6/15.
 */

import Dao from '../../dao/hms/basic/questionnaire'
import Const from '../../utils/const/questionnaire_const'
import cardConst from '../../utils/const/card_const';
import tools from '../../utils/tools';
import customerConst from  '../../utils/const/customer_const';
import cardDao from '../../dao/hms/assess/card';


export default {
    /**
     * 新增问卷
     * @param data
     * @returns {data}
     */
    create: async function (data) {
        'use strict';
        let query = {};
        query.questionnaireName = data.questionnaireName;
        let result = await Dao.findOne(query);
        if (!!result) {
            throw new Error(Const.QUESTIONNAIRE.QUESTIONNAIRE_IS_EXIST)
        } else {
            return Dao.create(data)

        }
    },
    /**
     * 根据条件查询
     * @param query
     * @param paginates
     * @param orderby
     */
    findByQuery: async function (query, paginates, orderby) {
        'use strict';
        query['isDelete'] = query['isDelete'] || false;
        return Dao.findByQuery(query, paginates, orderby)
    },
    /**
     * 计算数量
     * @param query
     */
    count: async function (query) {
        'use strict';
        return Dao.count(query)
    },
    /**
     * 根据条件查询单个
     * @param query
     */
    findOne: async function (query) {
        'use strict';
        query['isDelete'] = query['isDelete'] || false;
        return Dao.findOne(query)
    },
    /**
     * 删除
     * @param id
     */
    remove: async function (id) {
        'use strict';
        let result = await Dao.findOne({id: id, isDelete: false});
        console.log('result>>>', result);
        if (!result) {
            throw new Error(Const.QUESTIONNAIRE.QUESTIONNAIRE_NOT_EXIST)
        } else {
            return Dao.remove(id)
        }
    },

    update: async function (query, data) {
        'use strict';
        let result = await Dao.findOne(query);
        if (!result) {
            throw  new Error(Const.QUESTIONNAIRE.QUESTIONNAIRE_NOT_EXIST);
        } else {
            return Dao.update(query, data);
        }
    },


    getAvailableQuestionnaire: async function (info) {
        let ID = info.IDNumber;
        let basicInfo = tools.resolveID(ID);
        if (typeof basicInfo === 'string') {
            throw new Error(customerConst.CUSTOMER.WRONG_ID);
        }
        let age = tools.calAge(basicInfo.birthday);
        console.log(age);
        //@TODO 完成根据用户信息筛选问卷的方法。暂时写死。
        //已经通过身份证获取到用户年龄、性别，接下来需要根据需求进行判断，需要在问卷中添加限制条件用来筛选问卷。
        //当前只有一个问卷，暂时写死筛选条件。。

        //因为现阶段只有一套问卷,所以现在这里只针对这一套问卷进行处理。
        let query = {"constrains": [{"type": "age", "value": 18}]};
        if (age < 0.3){
            query = {"constrains": [{"type": "age", "value": 0.3}]};
        }
        let questionnaire = await this.findOne(query);

        let cardInfo = {};
        let data = await cardDao.findOne({id: info.cardId, isDelete: false});
        if(!questionnaire){
            throw new Error(Const.QUESTIONNAIRE.NO_FIT_QUESTIONNAIRE);
        }
        if (!data) {
            throw new Error(cardConst.ASSESSCARD.ASSESSCARD_IS_NOT_EXIST)
        } else {
            cardInfo = await cardDao.update({id: info.cardId}, {questionnaireId: questionnaire.id, questionnaireName: questionnaire.questionnaireName});
        }
        let result = {};
        result.questionnaire = questionnaire;
        result.cardInfo = cardInfo;
        result.customerInfo = basicInfo;
        return result;
    }
};
