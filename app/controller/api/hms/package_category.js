/**
 * Created by ZXF on 2016/8/12.
 */
import base from './base';
import categoryService from '../../../service/hms/package/package_category'
import packageItemService from '../../../service/hms/package/package_item'
import indicatorService from '../../../service/hms/package/package_indicator'
import commonConst from '../../../utils/common'
import extraTools from  '../../../utils/tools'

export default class extends base {

    /**
     * 添加套餐类别
     */
    async post() {
        let data = this.req.body;
        let res = commonConst.getSuccess();
        try {
            if (!data.categoryName || data.categoryName.trim() === '') {
                res = commonConst.getFail();
                res.error.message = '类别名称不可为空';
            } else {
                res.data = await categoryService.addCategory(data);
            }
        } catch (err) {
            res = commonConst.getFail();
            res.error.message = err.message;
        }
        this.json(res);
    }

    /**
     * 更新套餐类别
     */
    async put() {
        let data = this.req.body;
        let res = commonConst.getSuccess();
        let id = this.req.params.id;
        try {
            if (id && data.categoryName) {

                res.data = await categoryService.update({ id: id }, data);

                // 更新项目表类目名称
                await packageItemService.update({ categoryId: id }, { categoryName: data.categoryName });

                // 更新指标表类目名称
                await indicatorService.updateAll({ categoryId: id }, { categoryName: data.categoryName });
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
     * 获取套餐类别
     */
    async get() {
        let data = [];
        let rs = commonConst.getSuccess();
        rs.data = commonConst.getResData();
        let map = this.req.query || {};

        try {

            if (this.req.params.id) {
                map.id = this.req.params.id;
                data = await categoryService.findOne(map);
                if (data) {
                    rs.data = data
                } else {
                    rs = commonConst.getFail();
                }
            } else {

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

                let quy = {};

                if(map.search && map.search.trim()!==''){
                    quy.itemName = { contains: map.search };
                }


                rs.data.page = page;
                rs.data.pageSize = limit;
                rs.data.total = await categoryService.count(quy);
                data = await categoryService.findByQuery(quy, paginates, orderby);
                if (data) rs.data.items = data

            }

        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message
        }

        this.json(rs)
    }
}