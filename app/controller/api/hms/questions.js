/**
 * Created by huangjun on 16/6/7.
 *
 */
import base from './base'
import questionService from '../../../service/hms/questions'
import commonConst from '../../../utils/common'
import Const from '../../../utils/const/question_const'
import extraTools from '../../../utils/tools'

export default class extends base {
    //在G.controller.rest已经处理了简单的增、删、改、查
    // 如果有复杂的使用，可以自己调用service处理
    //get 直接调用默认的QUENSTION


//获取问题信息(查询\列表\详情)
    async get() {

        let data = [];
        let map = this.req.query || {};
        let rs = commonConst.getSuccess();
        rs.data = commonConst.getResData();
        try {
            if (this.req.params.id) {
                map.id = this.req.params.id;
                data = await questionService.findOne(map);
                if (data) {
                    rs.data = data
                } else {
                    rs = commonConst.getFail();
                    rs.error.message = Const.QUESTION.QUESTION_IS_NOT_EXIST
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

                //搜索所有  不分页
                if (map.search2 && !global._.isEmpty(map.search2)) {
                    map.questionName = {contains: map.search2};
                    paginates.limit = {};
                    delete map.search2;
                }

                //搜索分页
                if (map.search && !_.isEmpty(map.search)) {
                    map.questionName = { contains: map.search };
                    delete map.search;
                }


                
                rs.data.page = page;
                rs.data.pageSize = limit;
                rs.data.total = await questionService.count(map);
                data = await questionService.findByQuery(map, paginates, orderby);
                if (data) rs.data.items = data
            }
        } catch (error) {
            //T.debug(__filename,error.message)
            rs = commonConst.getFail();
            rs.error.message = error.message

        }


        this.json(rs)
    }

    //新增问题
    async post() {
        let data = this.req.body;
        let rs = commonConst.getSuccess();
        try {
            let count = await questionService.count({});
            data.questionSer = count + 1;
            data.isDelete = false;
            let result = await questionService.addQuestion(data);
            if (!!result) {
                rs.data = result
            } else {
                rs = commonConst.getFail();
                rs.error.message = Const.QUESTION.CREATED_FAILED
            }
        } catch (error) {
            //T.debug(__filename,error.message)
            rs = commonConst.getFail();
            rs.error.message = error.message

        }
        this.json(rs)
    }

    async put() {
        let id = this.req.params.id;
        let data = this.req.body;
        let rs = commonConst.getSuccess();
        if (!id) {
            rs = commonConst.getFail();
            rs.error.message = Const.QUESTION.REQUEST_ERROR;
        } else {
            try {
                let query = {id: id};
                rs.data = await questionService.update(query, data);
            } catch (error) {
                rs = commonConst.getFail();
                rs.error.message = error.message;
            }

        }
        this.json(rs)
    }


    //删除
    async delete() {
        //1. 检查参数
        //2. 直接调用super
        //super.delete()

        var map = this.req.params.id;
        var rs = commonConst.getSuccess();
        try {
            let result = await questionService.remove(map);
            if (!!result) {
                rs.data = result
            } else {
                rs = commonConst.getFail();
                rs.error.message = Const.QUESTION.CREATED_FAILED
            }
        } catch (error) {
            //T.debug(__filename,error.message)
            rs = commonConst.getFail();
            rs.error.message = error.message

        }
        this.json(rs)
    }
}
