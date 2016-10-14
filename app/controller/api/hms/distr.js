/**
 * Created by hgs on 16/7/23.
 *
 */

import base from './base'

import batchService from '../../../service/hms/assess/batch'
//import orgService from '../../../service/hms/organizations/organization'
//import capaciytService from '../../../service/hms/assess/capacity'
import distrService from '../../../service/hms/assess/distr'

import commonConst from '../../../utils/common'
import capacityConst from '../../../utils/const/capacity_const'
import extraTools from '../../../utils/tools'



export default class extends base {


    async get() {
        let data = [];
        let map = this.req.query || {};
        let rs = commonConst.getSuccess();
        rs.data = commonConst.getResData();
        try {


            if (this.req.params.id) {
                map.centerId = this.req.params.id;

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
                //map.centerId = order;
                map = extraTools.Query(map);
                if (map.search && !global._.isEmpty(map.search)) {
                    map.name = { contains: map.search };
                }
                delete map.search;
                rs.data.page = page;
                rs.data.pageSize = limit;
                let distrMap = {
                    centerId: map.centerId,
                    isDistribute: true,
                    totalCard: { '!': 0 }

                }
                rs.data.total = await batchService.count(distrMap);



                data = await distrService.findDistr(map, paginates, orderby);
                if (data) rs.data.items = data;
            }
        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message

        }
        this.json(rs)

    }


}