/**
 * Created by hgs on 16/7/21.
 *
 */

import base from './base'
import capaciytService from '../../../service/hms/assess/capacity'
import commonConst from '../../../utils/common'
import batchService from '../../../service/hms/assess/batch'
import batchConst from '../../../utils/const/batch_const'
import capacityConst from '../../../utils/const/capacity_const'

export default class extends base {

    //获取分配方案
    async get() {
        let data = [];
        let map = this.req.query || {};
        let capa = {};
        let rs = commonConst.getSuccess();
        rs.data = commonConst.getResData();

        try {

            if (this.req.params.id) {
                map.id = this.req.params.id;
                capa.batchId = map.id;
                let batchData = await batchService.findOne(map);        
                let capacityData = await capaciytService.find(capa);     
                if (batchData) {
                    rs.data.batch = batchData;
                    rs.data.capacity = capacityData;
                } else {
                    rs = commonConst.getFail();
                    rs.error.message = batchConst.BATCH.BATCH_NOT_EXIST;
                }
            } else {
                let order = this.req.query.order || 'id';
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
                rs.data.page = page;
                rs.data.pageSize = limit;
                rs.data.total = await capaciytService.count(map);
                data = await capaciytService.findByQuery(map, paginates, orderby);
                if (data) rs.data.items = data
            }



        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message;
        }
        this.json(rs)



    }

    //分配方案
    async post() {
        let data = this.req.body;
        let rs = commonConst.getSuccess();
        
        try {
            let result = await capaciytService.create(data);
            if (!!result) {
                rs.data = result;
            } else {
                rs = commonConst.getFail();
                rs.error.message = capacityConst.CAPACITY.CREATED_FAILED;
            }
        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message;
        }
      this.json(rs)
    }
}
