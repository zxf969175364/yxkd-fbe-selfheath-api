/**
 * Created by zj on 16/6/3.
 */

import base from './base'
import userService from '../../../service/hms/organizations/user'
import commonConst from '../../../utils/common'
import USER_CONST from '../../../utils/const/user_const'
import ORG_CONST from '../../../utils/const/organization_const'
import  extraTools from  '../../../utils/tools'


export default class extends base {
    //在G.controller.rest已经处理了简单的增、删、改、查
    // 如果有复杂的使用，可以自己调用service处理
    //get 直接调用默认的

    async get() {
        let data = [];
        let map = this.req.query || {};
        let rs = commonConst.getSuccess();
        rs.data = commonConst.getResData();
        try {
            if (this.req.params.id) {
                map.id = this.req.params.id;
                data = await userService.findOneWithOrgInfo(map);
                if (data) {
                    rs.data = data
                } else {
                    rs = commonConst.getFail();
                    rs.error.message = USER_CONST.NO_EXIST_USER;
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
                if (map.search && !_.isEmpty(map.search)){
                    map.realName = {contains: map.search};
                    delete map.search;
                }
                rs.data.page = page;
                rs.data.pageSize = limit;
                rs.data.total = await userService.count(map);
                data = await userService.findWithRoleInfo(map, paginates, orderby, this.req.session.user);
                if (data) rs.data.items = data
            }

        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message
        }

        this.json(rs)
    }
    
    async post() {
        let data = this.req.body;
        let res = commonConst.getSuccess();
        data.isDelete = data.isDelete || false;
        data.isPreset = false;
        console.log(this.req.session.user);
        if (this.req.session.user.roleType === "ADMIN" || this.req.session.user.roleType === "SUADMIN"){
            try {
                data.roleType = "ADMIN";
                res.data = await userService.addAccessUser(data);
            } catch (err) {
                res = commonConst.getFail();
                res.error.message = err.message;
            }
        }else {
            if (data.roleType === "HOSPITAL" && (!data.agencyId)){
                res = commonConst.getFail();
                res.error.message = USER_CONST.NO_AGENCY_ID;
            }else if (data.roleType === "CENTER" && (!data.agencyId)) {
                res = commonConst.getFail();
                res.error.message = USER_CONST.NO_AGENCY_ID;
            }else if (data.roleType === "CENTER" && (!data.hospitalId)) {
                res = commonConst.getFail();
                res.error.message = USER_CONST.NO_HOSPITAL_ID;
            }else if (!data.orgID){
                res = commonConst.getFail();
                res.error.message = USER_CONST.NO_ORG_ID;
            }else if (!data.roleID){
                res = commonConst.getFail();
                res.error.message = USER_CONST.NO_ROLE_ID;
            }else if (!data.password){
                res = commonConst.getFail();
                res.error.message = USER_CONST.NO_PWD;
            }else if (!data.cfPassword){
                res = commonConst.getFail();
                res.error.message = USER_CONST.NO_CFPWD;
            }else {
                try {
                    res.data = await userService.addAccessUser(data);
                } catch (err) {
                    res = commonConst.getFail();
                    res.error.message = err.message;
                }
            }

        }
        
        this.json(res);
    }

    async put() {
        let id = this.req.params.id;
        let data = this.req.body;
        if (data.password === null){    //这里有个小 bug, 如果 password 为 null,则在用crypto 进行编码时会报错,所以这里检查一下,如果为 null,则直接删除。
            delete data.password;
            delete data.cfPassword;
        }
        let res = commonConst.getSuccess();
        let userInfo = this.req.session.user;
        if (!userInfo){
            res = commonConst.getFail();
            res.error.message = USER_CONST.NO_PERMISS
        }else{
            if (!!id) {
                let query = {};
                if (userInfo.roleType === "SUADMIN" || userInfo.roleType === "ADMIN"){
                    query = {roleType: data.roleType, id:id}
                }else {
                    query = {orgID: userInfo.orgId ,id: id};
                }
                res.data = await userService.update(query, data)
            } else {
                res = commonConst.getFail();
                res.error.message = USER_CONST.NO_USER_ID;
            }
        }

        this.json(res);

    }

    async delete() {
        let res = commonConst.getSuccess();
        let data = this.req.body;
        let session = this.req.session.user;
        if (!!this.req.params.id) {
            res.data = await userService.remove(this.req.params.id);
        }else if (data){
            let ids = JSON.parse(data.data)
            res.data = await userService.delMutil(ids, session);
        }else {
            res = commonConst.getFail();
            res.error.message = USER_CONST.NO_USER_ID;
        }
        this.json(res);
    }
}
