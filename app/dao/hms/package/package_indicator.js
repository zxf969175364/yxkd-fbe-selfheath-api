/**
 * Created by hgs on 16/9/5.
 * 指标操作
 */

export default {
    /**
     * 新增指标
     * @param assessCard
     */
    create: async function (indicator) {
        'use strict';
        return D.model('package_indicator').create(indicator).toPromise();
    },

    /**
     * 根据条件查询
     * @param query
     * @param paginates
     * @param orderby
     */
    findByQuery: async function (query, paginates, orderby) {
        'use strict';
        return D.model('package_indicator').find(query).paginate(paginates).sort(orderby).toPromise();

    },
    /**
     * 计算数量
     * @param query
     */
    count: async function (query) {
        'use strict';
        query = query || {};
        query['isDelete'] = query['isDelete'] || false;
        return D.model('package_indicator').count(query).toPromise();
    },
    /**
     * 查询单条数据
     * @param query
     */
    findOne: async function (query) {
        'use strict';
        return D.model('package_indicator').findOne(query);
    },
    // /**
    //  * 删除测评卡
    //  * @param cardId
    //  */
    remove: async function (Id) {
        'use strict';
        return D.model('package_indicator').update({ id: Id }, { isDelete: true }).toPromise()
    },
    //   //真正的删除批次，回滚使用慎用
    //   destroy: async function (batchId) {
    //     'use strict';
    //     return D.model('package_indicator').destroy({ batchId: batchId }).toPromise()
    //   },
    /**
     * 更新测指标
     * @param query
     * @param card
     */
    update: async function (query, indicator) {
        'use strict';
        return D.model('package_indicator').update(query, indicator).toPromise()
    },

    findWithGroupBy: async function (query, groupFiled, countFiled) {
        'use strict';
        return D.model('package_indicator').find(query).groupBy(groupFiled).sum(countFiled);
    },


    find: async function (query) {
        'use strict';
        query = query || {};
        query['isDelete'] = query['isDelete'] || false;
        return D.model('package_indicator').find(query).toPromise();
    },
    max: async function (query) {
        'use strict';
        // query['isOld'] = query['isOld'] || false;
        return D.model('package_indicator').find({ isOld: false }).max(query).toPromise();
    },

    countAll: async function () {
        'use strict';
        return D.model('package_indicator').count();
    }

}