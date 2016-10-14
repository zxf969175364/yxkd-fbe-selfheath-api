/**
 * Created by huangjun on 16/6/15.
 */
import base from './base'
import QService from '../../../service/hms/questionnaire'
import commonConst from '../../../utils/common'
import Const from '../../../utils/const/question_const'
import extraTools from '../../../utils/tools'

export default class extends base {
  //在G.controller.rest已经处理了简单的增、删、改、查
  // 如果有复杂的使用，可以自己调用service处理
  //get 直接调用默认的QUENSTION


//获取问卷信息(查询\列表\详情)
  async get() {

    let data = [];
    let map = this.req.query || {};
    let rs = commonConst.getSuccess();
    rs.data = commonConst.getResData();
    try {
      if (this.req.params.id) {
        map.id = this.req.params.id;
        data = await QService.findOne(map);
        if (data) {
          rs.data = data
        } else {
          rs = commonConst.getFail();
          rs.error.message = Const.QUESTIONNAIRE.QUESTIONNAIRE_NOT_EXIST
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
          map.questionnaireName = { contains: map.search };
          delete map.search;
        }


        rs.data.page = page;
        rs.data.pageSize = limit;
        rs.data.total = await QService.count(map);
        data = await QService.findByQuery(map, paginates, orderby);
        if (data) rs.data.items = data
      }

    } catch (error) {
      rs = commonConst.getFail();
      rs.error.message = error.message
    }


    this.json(rs)
  }

  async put() {
    let id = this.req.params.id;
    let data = this.req.body;
    let rs = commonConst.getSuccess();
    if (id) {
      try {
        let query = {id: id, isDelete: false};
        rs.data = await QService.update(query, data);
      } catch (error) {
        rs = commonConst.getFail();
        rs.error.message = error.message
      }
    } else {
      rs = commonConst.getFail();
      rs.error.message = Const.QUESTION.REQUEST_ERROR
    }
    this.json(rs)
  }


  //新增问卷
  async post() {
    let data = this.req.body;
    let rs = commonConst.getSuccess();

    try {
      let result = await QService.create(data);
      if (!!result) {
        rs.data = result
      } else {
        rs = commonConst.getFail();
        rs.error.message = Const.QUESTIONNAIRE.CREATED_FAILED
      }
    } catch (error) {
      //T.debug(__filename,error.message)
      rs = commonConst.getFail();
      rs.error.message = error.message

    }
    this.json(rs)
  }

  //删除
  async delete() {
    //1. 检查参数
    //2. 直接调用super
    //super.delete()

    var map = this.req.params.id;
    console.log('data>>>>', map);
    var rs = commonConst.getSuccess();
    try {
      let result = await QService.remove(map);
      if (!!result) {
        rs.data = result
      } else {
        rs = commonConst.getFail();
        rs.error.message = Const.QUESTIONNAIRE.DELETE_DATA_FAILED
      }
    } catch (error) {
      //T.debug(__filename,error.message)
      rs = commonConst.getFail();
      rs.error.message = error.message

    }
    this.json(rs)
  }
}