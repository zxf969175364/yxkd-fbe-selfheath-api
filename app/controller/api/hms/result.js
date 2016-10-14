/**
 * Created by huangjun on 16/6/14.
 * 问卷实例
 */
import QService from '../../../service/hms/result'
import base from './base'
import commonConst from '../../../utils/common'
import Const from '../../../utils/const/result_const'
import rConst from  '../../../utils/const/rule_const';
import extraTools from '../../../utils/tools'
import calScore from '../../../service/hms/submit_section';

export default class extends base {

  //新增问卷答案并返回结果
  async post() {
    let data = this.req.body;
    let res = commonConst.getSuccess();
    let score;
    try {
      score = await calScore.calSectionScore(data);
      if (score !== undefined) {
        let level = await calScore.contentViaScore(data, score);
        if (!!level) {
          data.section[0].result = level;
          data.section[0].result.score = score;
        } else {
          res = commonConst.getFail();
          res.error.message = rConst.CALCULATE_LEVEL_ERROR;
        }
        let result = await QService.addQAnswer(data);
        if (!!result) {
          res.data = result
        } else {
          res = commonConst.getFail();
          res.error.message = Const.RESULT.CREATED_FAILED
        }
      } else {
        res = commonConst.getFail();
        res.error.message = rConst.CALCULATE_SCORE_ERROR;
      }
    } catch (err) {
      res = commonConst.getFail();
      res.error.message = err.message;
    }
    this.json(res)
  }

  //获取问卷答案(查询\列表\详情)
  async get() {


    let data = [];
    let map = this.req.query || {};
    let rs = commonConst.getSuccess();
    rs.data = commonConst.getResData();

    if (!!this.req.params.id) {
      map.id = this.req.params.id;
      data = await QService.findOne(map);
      if (data) {
        rs.data = data
      } else {
        rs = commonConst.getFail();
        rs.error.message = Const.RESULT.RESULT_NOT_EXIST
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
      console.log('query conditions:', map);
      rs.data.page = page;
      rs.data.pageSize = limit;
      rs.data.total = await QService.count(map);
      data = await QService.findByQuery(map, paginates, orderby);
      if (!!data) rs.data.items = data
    }
    this.json(rs)
  }


}