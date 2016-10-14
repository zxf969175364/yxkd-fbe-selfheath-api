/**
 * Created by zjp on 16/9/8.
 */

import base from './base';
import CONST from '../../../utils/common';
import prService from '../../../service/hms/rules/package_rule';
import ruleCONST from '../../../utils/const/rule_const';
import extraTools from  '../../../utils/tools'

export default class extends base {

    async post() {
        let data = this.req.body;
        let res = CONST.getSuccess();
        console.log(data);
        if (!data.ruleName) {
            res = CONST.getFail();
            res.error.message = ruleCONST.NO_RULE_NAME;
        }else if (!data.centerId){
            res = CONST.getFail();
            res.error.message = ruleCONST.NO_CENTER_ID;
        }else if (!data.cases || data.cases.length < 0){
            res = CONST.getFail();
            res.error.message = ruleCONST.NO_RUlE_CASE;
        }else if (!data.items){
            res = CONST.getFail();
            res.error.message = ruleCONST.NO_RULE_ITEM;
        }else {
            let str = "";  //添加辅助字段，方便查询。
            _.forEach(data.items, function (v) {
                str = str + "," + v.indicatorId;
            });
            data.idString = str;
            res.data = await prService.create(data);
        }

        this.json(res);
    }

    async get() {

        let data = [];
        let map = this.req.query || {};
        let rs = CONST.getSuccess();
        rs.data = CONST.getResData();
        try {
            if (this.req.params.id) {
                map.id = this.req.params.id;
                data = await prService.findOne(map);
                if (data) {
                    rs.data = data
                } else {
                    rs = CONST.getFail();
                    rs.error.message = ruleCONST.RULE_NOT_EXIST;
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

                    map.ruleName = {contains: map.search};
                    delete map.search;
                }

                rs.data.page = page;
                rs.data.pageSize = limit;
                rs.data.total = await prService.count(map);
                data = await prService.findByQuery(map, paginates, orderby);
                if (data) rs.data.items = data
            }
        } catch (error) {
            rs = CONST.getFail();
            rs.error.message = error.message

        }
        this.json(rs)
    }


    async put() {

        let id = this.req.params.id;
        let data = this.req.body;
        let res = CONST.getSuccess();
        if (!id){
            res = CONST.getFail();
            res.error.message = ruleCONST.NO_RULE_ID;
        }
        let query = {id: id};
        res.data = await prService.update(query, data);
        this.json(res);
    }

    async delete(){
        let id = this.req.params.id;
        let res = CONST.getSuccess();
        if (!id){
            res = CONST.getFail();
            res.error.message = ruleCONST.NO_RULE_ID;
        }
        res.data = await prService.update({id: id}, {isDelete: true});
        this.json(res);
    }

};