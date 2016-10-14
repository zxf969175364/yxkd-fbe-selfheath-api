/**
 * Created by hgs on 16/7/22.
 *
 */

import base from './base'
import commonConst from '../../../utils/common'
import batchConst from '../../../utils/const/batch_const'
import organizConst from '../../../utils/const/organization_const'
import orgService from '../../../service/hms/organizations/organization'





export default class extends base {

    async get() {
        let data = [];
        let map = this.req.query || {};     
        let rs = commonConst.getSuccess();
        rs.data = commonConst.getResData();
        try {
            if (this.req.params.id){
                map.centerId = this.req.params.id; 
                orgData = await orgService.findOne(map);

                if (orgData) {
                    rs.data = orgData;              
                }else {
                    rs = commonConst.getFail();
                    rs.error.message = organizConst.ORG_NOT_EXIST;
                }
            }else {
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
                if(data) rs.data.items = data
            }
        }catch (error){
            rs = commonConst.getFail();
            rs.error.message = error.message;
        }

    }

    async put() {
        let data = this.req.body;
        let res = commonConst.getSuccess();
        if (!this.req.params.id && this.req.params.id !== "") {
            res = commonConst.getFail();
            res.error.message = organizConst.NO_ORG_ID;
        }else if (_.indexOf(CONST.ROLE, data.roleType) <= -1) {
            res = commonConst.getFail();
            res.error.message = organizConst.ROLE_TYPE_ERROR;
        }else if(!data.name){
            res = commonConst.getFail();
            res.error.message = organizConst.NO_ORG_NAME;
        }else{
            try {
                let query = {id: this.req.params.id};
                res.data = await orgService.updateOrg(query,data);
            } catch (err) {
                res = commonConst.getFail();
                res.error.message = err.message;
            }
        }
        this.json(res);


    }

    
    
}