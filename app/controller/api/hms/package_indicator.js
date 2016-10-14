/*
 * @Author: hgs 
 * @Date: 2016-09-05 17:46:44 
 * @Last Modified by: hgs
 * @Last Modified time: 2016-09-23 12:05:32
 */

import base from './base'
import indicaService from '../../../service/hms/package/package_indicator'
import commonConst from '../../../utils/common'
import Const from '../../../utils/const/indicator_const'
import extraTools from  '../../../utils/tools'

export default class extends base {
    //获取测评卡信息(查询\列表\详情)
    async get() {

        let data = [];
        let map = this.req.query || {};

        let rs = commonConst.getSuccess();
        rs.data = commonConst.resData;

        try {
            if (this.req.params.id) {
                map.id = this.req.params.id;
                data = await indicaService.findOne(map);
                if (data) {
                    rs.data = data
                } else {
                    rs = commonConst.getFail();
                    rs.error.message = Const.INDICATOR_IS_NOT_EXIST;
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

                //获取模板字段
                if (map.system) {
                    map.centerId = 'SYSTEM';
                    delete map.system;
                }


                //搜索
                if (map.search && !_.isEmpty(map.search)) {
                    map.name = { contains: map.search };
                    delete map.search;
                }

                rs.data.page = page;
                rs.data.pageSize = limit;
                map['isDelete'] = false;

                if (this.req.session.user.roleType === 'SUADMIN') {
                    map.centerId = 'SYSTEM'
                }
                rs.data.total = await indicaService.count(map);
                // console.log(map)
                data = await indicaService.findByQuery(map, paginates, orderby);
                if (data) rs.data.items = data;
            }

        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message
        }

        this.json(rs)
    }

    //新增
    async post() {
        let data = this.req.body;
        let rs = commonConst.getSuccess();
        try {
            let result = await indicaService.addIndicator(data, this.req.session);
            if (!!result) {
                rs.data = result
            } else {
                rs = commonConst.getFail();
                rs.error.message = Const.CREATED_FAILED
            }
        } catch (error) {

            rs = commonConst.getFail();
            rs.error.message = error.message

        }
        this.json(rs)
    }
    //更新
    async put() {
        let data = this.req.body;
        let rs = commonConst.getSuccess();
        try {
            let result = await indicaService.updateIndica(data, this.req.session);
            rs.data = result;
        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message
        }
        this.json(rs)
    }

    async delete() {
        //1. 检查参数
        //2. 直接调用super
        //super.delete()

        let data = [];
        let result = {};
        let map = this.req.body || {};
        let rs = commonConst.getSuccess();
        rs.data = commonConst.getResData();
        try {
            if (this.req.params.id) {
                result = await indicaService.remove(this.req.params.id);
                if (!!result) {
                    rs.data = commonConst.DELETE_SUCCESS
                } else {
                    rs = commonConst.getFail();
                    rs.error.message = Const.DELETE_DATA_FAILED;
                }

                // result = await batchService.remove(map);
                // if (!!result) {
                //   rs.data = commonConst.DELETE_SUCCESS
                // } else {
                //   rs = commonConst.getFail();
                //   rs.error.message = Const.BATCH.DELETE_DATA_FAILED
                // }
            } else {
                // console.log(map)

                // // data = await batchService.removeDecide(map);
                // let result = await batchService.removeDecide(map, this.req.session);
                // if (result.res === 'SUCCESS') {
                //     // rs.delStatus = true;
                // } else {
                //     rs = commonConst.getWarning();
                //     rs.error.code = 556;
                //     rs.error.message = result.data;
                //     // rs.delStatus = false;
                // }

            }
        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message;
        }
        this.json(rs)
    }



}