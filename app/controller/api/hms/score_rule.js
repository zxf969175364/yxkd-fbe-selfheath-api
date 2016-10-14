/**
 * Created by zjp on 2016/7/5.
 */

import commConst from '../../../utils/common';
import ruleConst from '../../../utils/const/rule_const';
import srService from '../../../service/hms/rules/score_rule';
import extraTools from  '../../../utils/tools';
import base from './base';

export default class extends base {

    async post() {
        let data = this.req.body;
        data.isDelete = data.isDelete || false;
        let res = commConst.getSuccess();
        res.data = await srService.create(data);
        this.json(res);
    }

    async get() {
        let data = [];
        let map = this.req.query || {};
        let rs = commConst.getSuccess();
        rs.data = commConst.getResData();
        try {
            if (this.req.params.id) {
                map.id = this.req.params.id;
                data = await srService.findOne(map);
                if (data) {
                    rs.data = data
                } else {
                    rs = commConst.getFail();
                    rs.error.message = ruleConst.RULE_NOT_EXIST;
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
                
                if (map.search && !_.isEmpty(map.search)) {
                    map.section = { contains: map.search };
                    delete map.search;
                }


                console.log('query conditions:', map);
                rs.data.page = page;
                rs.data.pageSize = limit;
                rs.data.total = await srService.count(map);
                data = await srService.findByQuery(map, paginates, orderby);
                if (data) rs.data.items = data
            }
        } catch (error) {
            rs = commConst.getFail();
            rs.error.message = error.message
        }
        this.json(rs)
    }

    async delete(){
        let res = commConst.getSuccess();
        if(this.req.params.id){
            try{
                res.data = await srService.del({id: this.req.params.id});

            }catch(err){
                res = commConst.getFail();
                res.error.message = err.message;
            }
        }else{
            res = commConst.getFail();
            res.error.message = ruleConst.NO_RULE_ID;
        }
        this.json(res);
    }

    async put(){
        let res = commConst.getSuccess();
        let data = this.req.body;
        if (this.req.params.id){
            try{
                res.data = await srService.update({id: this.req.params.id, isDelete: false}, data);
            }catch(err){
                res = commConst.getFail();
                res.error.message = err.message;
            }
        }else {
            res = commConst.getFail();
            res.error.message = ruleConst.NO_RULE_ID;
        }
        this.json(res);
    }
}