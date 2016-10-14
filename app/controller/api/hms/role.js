/**
 * Created by zhaojinpeng on 2016/6/20 0020.
 */
import base from './base';
// let roleService = G.service.load('organization');
import roleService from '../../../service/hms/auth/role'
import commonConst from '../../../utils/common'
import ROLE_CONST from '../../../utils/const/role_const'
import ORG_CONST from '../../../utils/const/organization_const'
import extraTools from  '../../../utils/tools'

export default class extends base {

    /**
     * 添加组织
     */
    async post() {
        let data = this.req.body;
        let res = commonConst.getSuccess();
        data.isDelete = data.isDelete || false;
        data.isPreset = false;
        if (!data.roleName) {
            res = commonConst.getFail();
            res.error.message = ROLE_CONST.NO_ROLE_NAME;
        } else if (_.indexOf(ORG_CONST.ROLE, data.roleType) <= -1) {
            res = commonConst.getFail();
            res.error.message = ORG_CONST.ROLE_TYPE_ERROR;
        } else {
            try {
                res.data = await roleService.addAccessRole(data);
            } catch (err) {
                res = commonConst.getFail();
                res.error.message = err.message;
            }
        }
        this.json(res);
    }

    /**
     * 获取所有组织或者获取某个组织
     */
    async get() {
        let data = [];
        console.log(this.req.session.user);
        let rs = commonConst.getSuccess();
        rs.data = commonConst.getResData();
        let userInfo = this.req.session.user;
        let map = this.req.query;
        console.log(userInfo);
        if (!userInfo){
            rs = commonConst.getFail();
            rs.error.message = "用户未登录"
        } else {
            switch(userInfo.roleType){
                case "SUADMIN":
                    map.roleType = "ADMIN";
                    break;
                case "ADMIN":
                    map.roleType = "ADMIN";
                    break;
                case "AGENCY":
                    map.agencyId = userInfo.orgId;
                    break;
                case "HOSPITAL":
                    map.hospitalId = userInfo.orgId;
                    break;
                case "CENTER":
                    map.centerId = userInfo.orgId;
                    break;

            }
        }
        // let map = this.req.query || {};


        try {
            if (this.req.params.id) {
                map.id = this.req.params.id;
                data = await roleService.findOne(map);
                if (data) {
                    rs.data = data
                } else {
                    rs = commonConst.getFail();
                    rs.error.message = ROLE_CONST.ROLE_NOT_EXIST;
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
                    map.roleName = { contains: map.search };
                }
                delete map.search;
                rs.data.page = page;
                rs.data.pageSize = limit;
                rs.data.total = await roleService.count(map);
                data = await roleService.findByQuery(map, paginates, orderby);
                if (data) rs.data.items = data
            }

        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message
        }

        this.json(rs)
    }

    /**
     * 更新代理商信息
     */
    async put() {
        let data = this.req.body;
        let res = commonConst.getSuccess();
        if (!this.req.params.id && this.req.params.id !== "") {
            res = commonConst.getFail();
            res.error.message = ROLE_CONST.NO_ROLE_ID;
        } else if (_.indexOf(ORG_CONST.ROLE, data.roleType) <= -1) {
            res = commonConst.getFail();
            res.error.message = ORG_CONST.ROLE_TYPE_ERROR;
        } else if (!data.roleName) {
            res = commonConst.getFail();
            res.error.message = ROLE_CONST.NO_ROLE_NAME;
        } else {
            try {
                let query = { id: this.req.params.id };
                res.data = await roleService.update(query, data);
            } catch (err) {
                res = commonConst.getFail();
                res.error.message = err.message;
            }
        }
        this.json(res);


    }

    /**
     * 删除代理商，假删除
     */
    async delete() {
        let res = commonConst.getSuccess();
        let data = this.req.body;
        if (!!this.req.params.id) {
            let query = { id: this.req.params.id };
            res.data = await roleService.del(query);
        } else if (data && data.data){
            let userInfo = this.req.session.user;
            let ids = JSON.parse(data.data);
            res.data = await roleService.delMutil(ids, userInfo);
        } else {
            res = commonConst.getFail();
            res.error.message = ROLE_CONST.NO_ROLE_ID;
        }
        this.json(res);
    }


}