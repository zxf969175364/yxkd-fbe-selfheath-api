/**
 * Created by ZXF on 2016/8/12.
 */
import base from './base';
import exclusiveService from '../../../service/hms/package/package_item_exclusive'
import packageItemService from '../../../service/hms/package/package_item'
import commonConst from '../../../utils/common'
import extraTools from  '../../../utils/tools'

export default class extends base {

    /**
     * 添加互斥项目
     */
    async post() {
        let data = this.req.body;
        let res = commonConst.getSuccess();
        try {
            if (!data.exclusiveName || data.exclusiveName.trim() === '') {
                res = commonConst.getFail();
                res.error.message = '互斥项目组名称不可为空';
            } else if (!data.exclusiveItems || data.exclusiveItems.length === 0) {
                res = commonConst.getFail();
                res.error.message = '互斥项目不可为空';
            } else {

                let exItems = await exclusiveService.findByQuery({}, {}, {});
                let items = [];

                exItems.forEach(item => {
                    items = _.concat(items, item.exclusiveItems);
                });

                let isTrue = false;

                data.exclusiveItems.forEach(item => {
                    if (_.includes(items, item)) {
                        res = commonConst.getFail();
                        res.error.message = '互斥项目不可重复选择';
                        isTrue = true;
                    }
                });

                if (!isTrue) {
                    res.data = await exclusiveService.addExclusive(data);
                }

            }
        } catch (err) {
            res = commonConst.getFail();
            res.error.message = err.message;
        }
        this.json(res);
    }

    /**
     * 更新互斥项目
     */
    async put() {
        let data = this.req.body;
        let res = commonConst.getSuccess();
        let id = this.req.params.id;
        try {
            if (id && data.exclusiveItems && data.exclusiveItems.length !== 0) {

                let exItems = await exclusiveService.findByQuery({}, {}, {});
                let items = [];

                exItems.forEach(item => {
                    if (item.id != id) {
                        items = _.concat(items, item.exclusiveItems);
                    }
                });

                let isTrue = false;

                data.exclusiveItems.forEach(item => {
                    if (_.includes(items, item)) {
                        res = commonConst.getFail();
                        res.error.message = '互斥项目不可重复选择';
                        isTrue = true;
                    }
                });
                if (!isTrue) {
                    res.data = await exclusiveService.update({ id: id }, data);
                }
            } else {
                res = commonConst.getFail();
                res.error.message = '缺少参数';
            }
        } catch (err) {
            res = commonConst.getFail();
            res.error.message = err.message;
        }
        this.json(res);
    }

    /**
     * 获取互斥项目
     */
    async get() {
        let data = [];
        let rs = commonConst.getSuccess();
        rs.data = commonConst.getResData();
        let map = this.req.query || {};

        try {

            if (map.isSelect && map.isSelect === 'select') {

                let exItems = await exclusiveService.findByQuery({}, {}, {});
                let items = [];

                exItems.forEach(item => {
                    items = _.concat(items, item.exclusiveItems);
                });

                let quy = {
                    id: { '!': items }
                };

                if (map.categoryId && map.categoryId !== '') {
                    quy.categoryId = map.categoryId;
                }

                let selectItems = await packageItemService.findByQuery(quy, {}, { createdAt: 'desc' });

                rs = commonConst.getSuccess();
                rs.data = selectItems;

            } else if (this.req.params.id) {
                map.id = this.req.params.id;
                data = await exclusiveService.findOne(map);

                if (data) {

                    for (let i in data.exclusiveItems) {

                        let item = await packageItemService.findOne({ id: data.exclusiveItems[i] });

                        data.exclusiveItems[i] = {
                            itemName: item.itemName,
                            itemId: item.id
                        }

                    }

                    rs.data = data
                } else {
                    rs = commonConst.getFail();
                }
            }

            else {

                let order = this.req.query.order || 'createdAt';
                let sort = this.req.query.sort || 'desc';
                let orderby = {};
                orderby[order] = sort;

                let page = parseInt(this.req.query.page) || 1;
                let limit = parseInt(this.req.query.pageSize) || 10;
                let paginates = {
                    page: page,
                    limit: limit
                };
                map = extraTools.Query(map);

                if(map.search && map.search.trim() !== '') {
                    map.exclusiveName = { contains: map.search };
                    delete map.search;
                }

                rs.data.page = page;
                rs.data.pageSize = limit;
                rs.data.total = await exclusiveService.count(map);
                data = await exclusiveService.findByQuery(map, paginates, orderby);

                if (data) rs.data.items = data

            }

        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message
        }

        this.json(rs)
    }
}