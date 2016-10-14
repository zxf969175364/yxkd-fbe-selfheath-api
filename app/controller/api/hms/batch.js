/**
 * Created by huangjun on 16/6/21.
 *
 */
import base from './base'
import batchService from '../../../service/hms/assess/batch'
import commonConst from '../../../utils/common'
import Const from '../../../utils/const/batch_const'
import extraTools from '../../../utils/tools'

export default class extends base {
  //在G.controller.rest已经处理了简单的增、删、改、查
  // 如果有复杂的使用，可以自己调用service处理
  //super.get() 直接调用默认的


  //获取问题信息(查询\列表\详情)
  async get() {

    let data = [];
    let map = this.req.query || {};
    let rs = commonConst.getSuccess();
    rs.data = commonConst.getResData();
    try {
      if (this.req.params.id) {
        map.id = this.req.params.id;
        data = await batchService.findOne(map);
        if (data) {
          rs.data = data
        } else {
          rs = commonConst.getFail();
          rs.error.message = Const.BATCH.BATCH_NOT_EXIST
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

          map.batchName = { contains: map.search };
          delete map.search;
        }

        rs.data.page = page;
        rs.data.pageSize = limit;
        rs.data.total = await batchService.count(map);
        // data = await batchService.findByQuery(map, paginates, orderby);
        data = await batchService.findByQueryAndCount(map, paginates, orderby);

        if (data) rs.data.items = data
      }
    } catch (error) {
      rs = commonConst.getFail();
      rs.error.message = error.message

    }



    this.json(rs)
  }

  //新增批次
  async post() {
    let data = this.req.body;
    let rs = commonConst.getSuccess();
    try {
      let result = await batchService.create(data);
      if (!!result) {
        rs.data = result
      } else {
        rs = commonConst.getFail();
        rs.error.message = Const.BATCH.CREATED_FAILED
      }
    } catch (error) {
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

    let data = [];
    // let result = {};
    let map = this.req.body || {};
    let rs = commonConst.getSuccess();
    rs.data = commonConst.getResData();
    try {
      if (this.req.params.id) {
        // result = await batchService.remove(map);
        // if (!!result) {
        //   rs.data = commonConst.DELETE_SUCCESS
        // } else {
        //   rs = commonConst.getFail();
        //   rs.error.message = Const.BATCH.DELETE_DATA_FAILED
        // }
      } else {
        // console.log(map)

        // data = await batchService.removeDecide(map);
        let result = await batchService.removeDecide(map, this.req.session);
        if (result.res === 'SUCCESS') {
          // rs.delStatus = true;
        } else {
          rs = commonConst.getWarning();
          rs.error.code = 556;
          rs.error.message = result.data;
          // rs.delStatus = false;
        }

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
      let result = await batchService.update(data);
      rs.data = result;
    } catch (error) {
      rs = commonConst.getFail();
      rs.error.message = error.message
    }
    this.json(rs)
  }
}
