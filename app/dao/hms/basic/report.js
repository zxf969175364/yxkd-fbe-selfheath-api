/**
 * Created by zjp on 16/7/31.
 */

export default {
    /**
     * 新增问卷实例
     * @param data
     */
    create: async function (data) {
        'use strict';
        return D.model('report').create(data).toPromise();
    },
    /**
     * 根据条件查询问卷实例
     * @param query
     * @param paginates
     * @param orderby
     */
    findByQuery: async function (query, paginates, orderby) {
        'use strict';
        return D.model('report').find(query).paginate(paginates).sort(orderby).toPromise();

    },
    /**
     * 计算数量
     * @param query
     */
    count: async function (query) {
        'use strict';
        return D.model('report').count(query).toPromise()
    },
    /**
     * 查询单条数据
     * @param query
     */
    findOne: async function (query) {
        'use strict';
        return D.model('report').findOne(query).toPromise();
    },
    find: async function (query) {
        'use strict';
        return D.model('report').find(query).toPromise()
    },
    /**
     * 删除
     * @param id
     */
    remove: async function (id) {
        'use strict';
        return D.model('report').update({ id: id }, { isDelete: true }).toPromise()
    },
    /**
     * 更新
     * @param query
     * @param data
     * @param option
     */
    update: async function (query, data, option) {
        'use strict';
        return D.model('report').update(query, data, option).toPromise()
    }


}