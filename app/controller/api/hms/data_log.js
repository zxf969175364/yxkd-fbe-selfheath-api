/**
 * Created by ZXF on 2016/8/12.
 */
import base from './base';
// let roleService = G.service.load('organization');
import dataLogService from '../../../service/hms/data_log'
import commonConst from '../../../utils/common'
import extraTools from  '../../../utils/tools'

export default class extends base {

    /**
     * 添加测评数据日志
     */
    async post() {
        let data = this.req.body;
        let res = commonConst.getSuccess();
        try {
            res.data = await dataLogService.addDataLogDao(data);
        } catch (err) {
            res = commonConst.getFail();
            res.error.message = err.message;
        }
        this.json(res);
    }

    /**
     * 获取所有测评数据日志
     */
    async get() {
        let data = [];
        let rs = commonConst.getSuccess();
        rs.data = commonConst.getResData();
        let map = this.req.query || {};

        try {
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
            //测评数据日志创建时间区间
            if (map.createdAtStart || map.createdAtEnd) {
                map.createdAt = {};
                map.createdAtStart ? map.createdAt[">="] = map.createdAtStart : "";
                map.createdAtEnd ? map.createdAt["<="] = map.createdAtEnd : "";
                delete map.createdAtStart;
                delete map.createdAtEnd;
            }

            rs.data.page = page;
            rs.data.pageSize = limit;
            rs.data.total = await dataLogService.count(map);
            data = await dataLogService.findByQuery(map, paginates, orderby);
            if (data) rs.data.items = data

        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message
        }

        this.json(rs)
    }
}