/**
 * Created by ZXF on 2016/8/12.
 */
import base from './base';
import packageItemService from '../../../service/hms/package/package_item'
import packageCategoryService from '../../../service/hms/package/package_category'
import packageIndicatorService from '../../../service/hms/package/package_indicator'
import commonConst from '../../../utils/common'
import extraTools from  '../../../utils/tools'

export default class extends base {

    /**
     * 添加套餐项目
     */
    async post() {
        let data = this.req.body;
        let res = commonConst.getSuccess();
        try {
            // 是否是科室选择项目保存
            if (!data.categoryId
                || !data.itemName) {

                res = commonConst.getFail();
                res.error.message = '参数错误';
            } else {
                let category = await packageCategoryService.findOne({ id: data.categoryId });
                data.categoryName = category.categoryName;
                data.inPackageName = data.itemName;
                data.centerId = 'SYSTEM';

                res.data = await packageItemService.addPackageItem(data);

            }
        } catch (err) {
            res = commonConst.getFail();
            res.error.message = err.message;
        }
        this.json(res);
    }

    /**
     * 更新套餐项目
     */
    async put() {
        let data = this.req.body;
        let res = commonConst.getSuccess();
        let id = this.req.params.id;

        try {
            if (!id || !data.categoryId || !data.itemName) {
                res = commonConst.getFail();
                res.error.message = '参数错误';
            } else {

                let item = {};

                let packItem = await packageItemService.findOne({ id: id });

                if (data.centerId != 'SYSTEM') {

                    item.inPackageName = data.inPackageName;
                    item.place = data.place;
                    item.technology = data.technology;
                    item.instrument = data.instrument;
                    item.precautions = data.precautions;
                    item.significance = data.significance;

                    res.data = await packageItemService.update({ id: id }, item);

                    if (packItem.inPackageName !== item.inPackageName) {
                        await packageIndicatorService.updateAll({ itemId: id }, { inPackageName: item.inPackageName });
                    }

                } else {

                    item = data;

                    res.data = await packageItemService.update({ id: id }, item);

                    // 同步更新 指标表中项目名称
                    if (packItem.itemName !== item.itemName) {

                        item.inPackageName = item.itemName;

                        await packageItemService.update({ associateId: id }, { itemName: item.itemName });

                        let itemIds = await packageItemService.findAssItemIds(id);

                        await packageIndicatorService.updateAll({ itemId: itemIds }, { itemName: item.itemName });

                    }

                    // 同步更新 指标表中类目修改
                    if (packItem.categoryId !== item.categoryId) {
                        let category = await packageCategoryService.findOne({ id: data.categoryId });
                        item.categoryName = category.categoryName;

                        await packageItemService.update({
                            or: [
                                { id: id },
                                { associateId: id }
                            ]
                        }, {
                            categoryId: category.id,
                            categoryName: category.categoryName
                        });

                        let itemIds = await packageItemService.findAssItemIds(id);

                        await packageIndicatorService.updateAll({ itemId: itemIds }, {
                            categoryName: category.categoryName,
                            categoryId: category.id
                        });
                    }

                    // 同步更新 项目中项目可不可拆分
                    if (packItem.isSplit !== item.isSplit) {

                        await packageItemService.update({ associateId: id }, { isSplit: item.isSplit });

                        let itemIds = await packageItemService.findAssItemIds(id);

                        await packageIndicatorService.updateAll({ itemId: itemIds }, { isSplit: item.isSplit });

                    }

                }

            }
        } catch (err) {
            res = commonConst.getFail();
            res.error.message = err.message;
        }
        this.json(res);
    }

    /**
     * 获取套餐项目
     */
    async get() {
        let data = [];
        let rs = commonConst.getSuccess();
        rs.data = commonConst.getResData();
        let map = this.req.query || {};

        try {

            if (this.req.params.id) {
                map.id = this.req.params.id;
                data = await packageItemService.findOne(map);
                if (data) {
                    rs.data = data
                } else {
                    rs = commonConst.getFail();
                    rs.error.message = '没有这个项目';
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

                if (map.search && map.search.trim() !== '') {
                    map.itemName = { contains: map.search };
                    delete map.search;
                }

                map.centerId = 'SYSTEM';

                rs.data.page = page;
                rs.data.pageSize = limit;
                rs.data.total = await packageItemService.count(map);
                data = await packageItemService.findByQuery(map, paginates, orderby);
                if (data) rs.data.items = data

            }

        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message
        }

        this.json(rs)
    }

    /**
     * 删除套餐项目
     */
    async delete() {
        let res = commonConst.getSuccess();
        let id = this.req.params.id;
        try {

            if (!id || id.trim() == '') {
                res = commonConst.getFail();
                res.error.message = '项目ID不可为空';
                this.json(res);
                return;
            }

            let item = await  packageItemService.findOne({ id: id });

            if (!item) {
                res = commonConst.getFail();
                res.error.message = '无效的项目ID';
                this.json(res);
                return;
            }

            let ins = await packageIndicatorService.find({ itemId: id });

            if (ins && ins.length > 0) {
                res = commonConst.getFail();
                res.error.message = '请先删除项目下的指标';
                this.json(res);
                return;
            }

            await packageItemService.del({ id: id });

        } catch (err) {
            res = commonConst.getFail();
            res.error.message = err.message;
        }
        this.json(res);
    }

}