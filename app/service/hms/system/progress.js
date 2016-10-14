/**
 * Created by hgs on 2016/8/17.
 */
import proDao from '../../../dao/hms/system/progress'
import proConst from '../../../utils/const/progress_const'

export default {

    create: async function (data) {
        'use strict';
        return proDao.create(data);
    },

    update: async function (query, data) {
        'use strict';
        let exist = await proDao.find(query);
        if (!!exist) {
            return proDao.update(query,data);
        } else {
            throw new Error(proConst.PRO_NOT_EXIST);
        }
    },


    findOne: async function (query) {
        "use strict";
        // query['isDelete'] = query['isDelete'] || false;
        return proDao.findOne(query)
    },
    /**
     * 计算数量
     * @param query
     */
    count: async function (query) {
        "use strict";
        return proDao.count(query)
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
        return proDao.findByQuery(query, paginates, orderby)
    },

    find: async function (query) {
        'use strict';
        return proDao.find(query);
    },

    del: async function (query) {
        'use strict';
        let updateData = {isDelete: true};
        return  proDao.update(query, updateData);

    },
}