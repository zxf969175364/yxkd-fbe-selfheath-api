/**
 * Created by huangjun on 16/6/7.
 *
 */

export default {
    /**
     * 新增问题
     * @param question
     */
    create: async function (question) {
        'use strict';
        return D.model('questions').create(question);
    },

    /**
     * 根据条件查询
     * @param query
     * @param paginates
     * @param orderby
     */
    findByQuery: async function (query, paginates, orderby) {
        'use strict';
        return D.model('questions').find(query).paginate(paginates).sort(orderby).toPromise();

    },
    /**
     * 计算数量
     * @param query
     */
    count: async function (query) {
        'use strict';
        return D.model('questions').count(query).toPromise();
    },
    /**
     * 查询单条数据
     * @param query
     */
    findOne: async function (query) {
        'use strict';
        return D.model('questions').findOne(query);
    },
    /**
     * 删除问题
     * @param questionId
     */
    remove: async function (questionId) {
        "use strict";
        return D.model('questions').update({id: questionId}, {isDelete: true}).toPromise()
    },

    /**
     * 修改题目信息
     * @param query
     * @param question
     */
    update: async function (query, question) {
        "use strict";
        return D.model('questions').update(query, question).toPromise()
    }


};