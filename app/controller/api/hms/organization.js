/**
 * Created by G on 2016/6/17 0017.
 */
import base from './base';
// let orgService = G.service.load('organization');
import orgService from '../../../service/hms/organizations/organization'
import commonConst from '../../../utils/common'
import CONST from '../../../utils/const/organization_const'
import extraTools from  '../../../utils/tools'
import fs from 'fs';
import path from 'path';

export default class extends base {

    /**
     * 添加组织
     */
    async post() {
        let data = this.req.body;
        let res = commonConst.getSuccess();
        // data.organizationId = Math.floor(Math.random() * 10000000);
        data.isDelete = data.isDelete || false;
        //判断组织角色信息,
        if (_.indexOf(CONST.ROLE, data.roleType) <= -1) {
            res = commonConst.getFail();
            res.error.message = CONST.ROLE_TYPE_ERROR;
        } else if (!data.name) {
            res = commonConst.getFail();
            res.error.message = CONST.NO_ORG_NAME;
        } else {
            if (data.roleType === "HOSPITAL") {
                if (!data.agencyId) {
                    res = commonConst.getFail();
                    res.error.message = CONST.NO_AGENCY_ID
                }
            }
            if (data.roleType === "CENTER") {
                if (!data.agencyId) {
                    res = commonConst.getFail();
                    res.error.message = CONST.NO_AGENCY_ID
                }
                if (!data.hospitalId) {
                    res = commonConst.getFail();
                    res.error.message = CONST.NO_HOSPITAL_ID
                }
            }
            try {
                res.data = await orgService.addAccessOrg(data);
                if (data.fileName) {
                    let tmpPath = path.join(G.path.tmp, data.fileName);
                    let logoPath = G.path.app + '/static/logo/' + res.data.orgInfo[0].id + '.jpg';
                    data.logoUrl = '/static/logo/' + res.data.orgInfo[0].id + '.jpg?' + extraTools.random(8);
                    fs.rename(tmpPath, logoPath, function (err) {
                        if (err){
                            console.log(err);
                        }
                    });
                }
                await orgService.updateOrg({id: res.data.orgInfo[0].id},data);
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
        let map = this.req.query || {};
        let rs = commonConst.getSuccess();
        rs.data = commonConst.getResData();
        try {
            if (this.req.params.id) {
                map.id = this.req.params.id;
                data = await orgService.findOneWithAdmin(map);
                if (data) {
                    rs.data = data
                } else {
                    rs = commonConst.getFail();
                    rs.error.message = CONST.ORG_NOT_EXIST;
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
                map.isDelete = map.isDelete || false;
                if (map.search && !global._.isEmpty(map.search)) {
                    map.name = {contains: map.search};
                }
                delete map.search;
                rs.data.page = page;
                rs.data.pageSize = limit;
                rs.data.total = await orgService.count(map);
                data = await orgService.findByQuery(map, paginates, orderby);
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
            res.error.message = CONST.NO_ORG_ID;
        } else if (_.indexOf(CONST.ROLE, data.roleType) <= -1) {
            res = commonConst.getFail();
            res.error.message = CONST.ROLE_TYPE_ERROR;
        } else if (!data.name) {
            res = commonConst.getFail();
            res.error.message = CONST.NO_ORG_NAME;
        } else {
            if (data.fileName) {
                let tmpPath = path.join(G.path.tmp, data.fileName);
                let logoPath = G.path.app + '/static/logo/' + data.id + '.jpg';
                data.logoUrl = '/static/logo/' + data.id + '.jpg?' + extraTools.random(8);
                fs.rename(tmpPath, logoPath, function (err) {
                    if (err){
                        console.log(err);
                    }
                });
            }
            try {
                let query = {id: this.req.params.id};
                res.data = await orgService.updateOrg(query, data);
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

        let data = [];
        let map = this.req.body;
        let rs = commonConst.getSuccess();
        rs.data = commonConst.getResData();
        try {
            if (this.req.params.id) {
                let query = {id: this.req.params.id};
                data = await orgService.del(query);
                if (data) {
                    rs.data = data
                } else {
                    rs = commonConst.getFail();
                    rs.error.message = Const.BATCH.BATCH_NOT_EXIST
                }
            } else {
                let result = await orgService.delDecide(map, this.req.session);
                if (result.res === 'SUCCESS') {
                    rs.data = result.data;
                } else {
                    rs = commonConst.getFail();
                    rs.error.code = 555;
                    rs.error.message = result.data;
                }


            }
        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message;
        }
        // let res = commonConst.getSuccess();
        // if (!!this.req.params.id) {
        //     let query = {id:this.req.params.id};
        //     res.data = await orgService.del(query);
        // }else {
        //     res = commonConst.getFail();
        //     res.error.message = CONST.NO_ORG_ID;
        // }
        this.json(rs);
    }


}