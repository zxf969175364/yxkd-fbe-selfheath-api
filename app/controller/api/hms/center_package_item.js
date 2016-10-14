/**
 * Created by ZXF on 2016/8/12.
 */
import base from './base';
import packageItemService from '../../../service/hms/package/package_item'
import packageIndicatorService from '../../../service/hms/package/package_indicator'
import commonConst from '../../../utils/common'
import extraTools from  '../../../utils/tools'

export default class extends base {

    /**
     * 添加科室套餐项目
     */
    async post() {
        let data = this.req.body;
        let res = commonConst.getSuccess();
        let centerId = data.centerId;
        try {
            // 是否是科室选择项目保存
            if (centerId.toLowerCase() !== 'system') {

                if (data.items.length > 0) {

                    let indis = [];
                    let resultItem = {};

                    for (let i = 0; i < data.items.length; i++) {

                        let item = await packageItemService.findOne({
                            centerId: centerId,
                            associateId: data.items[i].itemId
                        });

                        if (!item) {
                            let ite = await packageItemService.findOne({
                                id: data.items[i].itemId
                            });
                            ite.centerId = centerId;
                            ite.associateId = data.items[i].itemId;
                            delete ite.id;
                            resultItem = await packageItemService.addPackageItem(ite);
                        } else {
                            resultItem = item;
                        }

                        data.items[i].itemId = resultItem.id;
                        data.items[i].associateId = data.items[i].id;
                        data.items[i].centerId = centerId;
                        delete data.items[i].id;

                        // 将项目内的套餐名称赋值给指标里面项目在套餐内名称
                        data.items[i].inPackageName = resultItem.inPackageName;
                        data.items[i].nameCenter = data.items[i].name;
                        data.items[i].isSplit = resultItem.isSplit;
                        indis.push(data.items[i]);
                    }

                    let indicator = await packageItemService.createPackageIndicator(indis);

                    let indicators = await packageIndicatorService.find({ itemId: resultItem.id });

                    let price = 0;

                    indicators.forEach(item => {
                        price += item.price;
                    });

                    await packageItemService.update({ id: resultItem.id }, { price: price });

                    res = commonConst.getSuccess();
                }
                else {
                    res = commonConst.getFail();
                    res.error.message = '请选择指标';
                }

            } else {
                res = commonConst.getFail();
                res.error.message = '参数错误';
            }

        } catch (err) {
            res = commonConst.getFail();
            res.error.message = err.message;
        }
        this.json(res);
    }

    /**
     * 查找科室套餐项目
     */
    async get() {
        let data = [];
        let rs = commonConst.getSuccess();
        rs.data = commonConst.getResData();
        let map = this.req.query || {};
        let centerId = map.centerId;

        try {

            if (!centerId || !map.isSelect || map.isSelect.trim() === '') {
                rs = commonConst.getFail();
                rs.error.message = '参数错误';
            }

            else if (map.isSelect && map.isSelect === 'select' && centerId && centerId.trim() !== '') {

                let page = parseInt(this.req.query.page) || 1;
                let limit = parseInt(this.req.query.pageSize) || 10;
                let paginates = {
                    page: page,
                    limit: limit
                };

                let quy = {
                    centerId: 'SYSTEM'
                };

                if (!map.itemId) {

                    let exItems = await packageIndicatorService.findByQuery({ centerId: centerId }, {}, {});
                    let items = [];

                    exItems.forEach(item => {
                        items.push(item.associateId);
                    });

                    quy.id = { '!': items };

                } else {
                    quy.id = map.itemId;
                }

                if (map.categoryId && map.categoryId !== '') {
                    quy.categoryId = map.categoryId;
                }

                if (map.search && map.search.trim() !== '') {
                    quy.or = [
                        { itemName: { contains: map.search } }
                    ]
                }

                let selectItems = await packageIndicatorService.findByQuery(quy, paginates, { createdAt: 'desc' });

                rs = commonConst.getSuccess();
                rs.data.page = page;
                rs.data.pageSize = limit;
                rs.data.total = await packageIndicatorService.count(quy);
                rs.data.items = selectItems;

            }

            else if (map.isSelect && map.isSelect === 'chosen' && centerId && centerId.trim() !== '') {

                let chosenQuy = {};
                chosenQuy.centerId = centerId;
                rs = commonConst.getSuccess();
                rs.data.items = await packageIndicatorService.findByQuery(chosenQuy, {}, { createdAt: 'desc' });

            }

            else if (map.isSelect && map.isSelect === 'all' && centerId && centerId.trim() !== '') {

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
                    map.or = [
                        { name: { contains: map.search } }
                    ];

                    delete map.search;
                }

                delete map.isSelect;
                rs = commonConst.getSuccess();
                rs.data.page = page;
                rs.data.pageSize = limit;
                rs.data.total = await packageIndicatorService.count(map);
                data = await packageIndicatorService.findByQuery(map, paginates, orderby);

                if (data) rs.data.items = data

            }

        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message
        }

        this.json(rs)
    }

    /**
     * 删除
     */
    async delete() {
        let res = commonConst.getSuccess();
        let id = this.req.params.id;
        try {

            let indicator = await packageIndicatorService.del({ id: id });
            res.data = indicator[0];

            let indicators = await packageIndicatorService.find({ itemId: indicator[0].itemId });

            let price = 0;

            if (indicators && indicators.length > 0) {

                indicators.forEach(item => {
                    price += item.price;
                });

            }

            await packageItemService.update({ id: indicator[0].itemId }, { price: price });

        } catch (err) {
            res = commonConst.getFail();
            res.error.message = err.message;
        }
        this.json(res);
    }

}
