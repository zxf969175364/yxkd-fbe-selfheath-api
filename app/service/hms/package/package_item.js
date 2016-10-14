/**
 * Created by ZXF on 2016/8/12.
 */
import itemDao from '../../../dao/hms/package/package_item'
import indicatorDao from '../../../dao/hms/package/package_indicator'

export default {
    /**
     * 新增项目
     * @param data
     * @returns {data}
     */
    addPackageItem: async function (data) {
        'use strict';
        return itemDao.create(data);
    },

    /**
     * 新增指标
     * @param data
     * @returns {data}
     */
    createPackageIndicator: async function (data) {
        'use strict';
        return indicatorDao.create(data);
    },

    /**
     * 根据条件查询
     * @param query
     * @param paginates
     * @param orderby
     */
    findByQuery : async function(query,paginates,orderby){
        'use strict';
        query['isDelete'] = query['isDelete'] || false;
        return itemDao.findByQuery(query,paginates,orderby)
    },
    /**
     * 计算数量
     * @param query
     */
    count : async function(query){
        'use strict';
        return itemDao.count(query)
    },
    /**
     * 根据条件查询单个
     * @param query
     */
    findOne : async function(query){
        'use strict';
        query['isDelete'] = query['isDelete'] || false;
        return itemDao.findOne(query)
    },
    /**
     * 更新
     * @param query
     * @param data
     * @param option
     * @returns {*}
     */
    update: async function(query,data,option){
        'use strict';
        return itemDao.update(query,data,option)
    },

    find: async function (query) {
        'use strict';
        query['isDelete'] = query['isDelete'] || false;
        return itemDao.find(query);
    },

    /**
     * 删除
     */
    del: async function (query) {
        'use strict';
        let updateData = { isDelete: true };
        return itemDao.update(query, updateData);
    },

    /**
     * 查找所有关联项目ID
     */
    findAssItemIds: async function(id) {
        'use strict';
        let items = await this.find({ associateId: id });

        let itemIds = [];

        itemIds.push(id);

        if (items && items.length > 0) {
            items.forEach(item => itemIds.push(item.id));
        }
        return itemIds;
    }

}