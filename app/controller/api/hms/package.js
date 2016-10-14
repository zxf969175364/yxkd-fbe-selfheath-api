/**
 * Created by zjp on 16/9/9.
 */

import base from './base';
import packageService from '../../../service/hms/package/package';
import CONST from '../../../utils/common';
import packageConst from '../../../utils/const/package_const';
import extraTools from '../../../utils/tools'

export default class extends base {

    /**
     * 创建固定套餐接口.
     */
    async post() {
        let data = this.req.body;
        let res = CONST.getSuccess();
        if (!data.centerId){
            res = CONST.getFail();
            res.error.message = packageConst.NO_CENTER_ID;
        }else {
            try {
                res.data = await packageService.create(data);
            } catch (err) {
                res = CONST.getFail();
                res.error.message = err.message;
            }

        }
        this.json(res);
    }

    /**
     * 获取登录科室下的所有固定套餐,其他用户请求一律报"请求错误".
     */
/*
    async get() {
        let session = this.req.session;
        let res = CONST.getSuccess();
        if (session && session.isLogin && session.user.roleType === "CENTER") {
            let centerId = session.user.orgId;
            let query = {centerId: centerId, isFixed: true};
            res.data = await packageService.find(query);
        } else {
            res = CONST.getFail();
            res.error.message = packageConst.ILLEGAL_REQUEST;
        }
        this.json(res);
    }
*/

    async get() {

        let data = [];
        let map = this.req.query || {};
        let rs = CONST.getSuccess();
        rs.data = CONST.getResData();
        console.log(rs);
        // let session = this.req.session;
        // if (session && session.isLogin && session.user.roleType === "CENTER") {
        //     let centerId = session.user.orgId;
        //     let query = {centerId: centerId, isFixed: true};
        //     rs.data = await packageService.find(query);
        // } else {
        //     res = CONST.getFail();
        //     res.error.message = packageConst.ILLEGAL_REQUEST;
        // }
        try {
            if (this.req.params.id) {
                map.id = this.req.params.id;
                data = await packageService.findOne(map);
                if (data) {
                    delete data.password;
                    delete data.updatedAt;
                    delete data.id;
                    rs.data = data;
                } else {
                    rs = CONST.getFail();
                    rs.error.message = packageConst.NO_PACKAGE_ID
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
                console.log(page);
                map = extraTools.Query(map);
                map.isFixed = map.isFixed === "true";
                let total = {};
                let isRange = false;
                if (map.max){
                    total['<='] = map.max;
                    isRange = isRange || true;
                    delete  map.max;
                }
                if (map.min){
                    total['>='] = map.min;
                    isRange = isRange || true;
                    delete  map.min;
                }
                if (isRange){
                    map.total = total;
                }
                if (map.search){
                    map.name = {'contains': map.search};
                    delete map.search;
                }
                rs.data.page = page;
                rs.data.pageSize = limit;
                rs.data.total = await packageService.count(map);
                data = await packageService.findByQuery(map, paginates, orderby);
                if (data) rs.data.items = data
            }
        } catch (error) {
            rs = CONST.getFail();
            rs.error.message = error.message

        }
        this.json(rs);
    }
}