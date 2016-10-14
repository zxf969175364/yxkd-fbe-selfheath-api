/**
 * Created by huangjun on 16/6/14.
 *
 * 测评卡controller
 */
import base from './base'
import cardService from '../../../service/hms/assess/card'
import commonConst from '../../../utils/common'
import Const from '../../../utils/const/card_const'
import extraTools from  '../../../utils/tools'

export default class extends base {
  //在G.controller.rest已经处理了简单的增、删、改、查
  // 如果有复杂的使用，可以自己调用service处理
  //get 直接调用默认的


  //获取测评卡信息(查询\列表\详情)
  async get() {

    let data = [];
    let map = this.req.query || {};
    let rs = commonConst.getSuccess();
    rs.data = commonConst.getResData();

    try {
      if (this.req.params.id) {
        map.id = this.req.params.id;
        data = await cardService.findOne(map);
        if (data) {
          rs.data = data
        } else {
          rs = commonConst.getFail();
          rs.error.message = Const.ASSESSCARD.ASSESSCARD_IS_NOT_EXIST
        }
      } else {
        let order = this.req.query.order || 'updateAt';
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
        if (map.search) {
          // console.log(map)
          delete map.search;
          // console.log(map.search);
          // console.log(map.cardNumber);

          //测评卡创建时间区间
          if (map.createdAtStart || map.createAtEnd) {
            map.createdAt = {};
            map.createdAtStart ? map.createdAt[">="] = map.createdAtStart : "";
            map.createAtEnd ? map.createdAt["<="] = map.createAtEnd : "";
            delete map.createdAtStart;
            delete map.createAtEnd;
          }

          //测评卡创更新时间区间
          if (map.updatedAtStart   || map.updatedAtEnd) {
            map.updatedAt = {};
            map.updatedAtStart ? map.updatedAt[">="] = map.updatedAtStart : "";
            map.updatedAtEnd ? map.updatedAt["<="] = map.updatedAtEnd : "";
            delete map.updatedAtStart;
            delete map.updatedAtEnd;
          }

          //测评卡体检时间区间
          if (map.checkDateStart || map.checkDateEnd) {
            map.checkDate = {};
            map.checkDateStart ? map.checkDate[">="] = map.checkDate : "";
            map.checkDateEnd ? map.checkDate["<="] = map.checkDate : "";
            delete map.checkDateStart;
            delete map.checkDateEnd;
          }

          //批次卡状态         
          if (map.status2) {
            switch (map.status2) {
              case '未使用':
                map.status = 'UNUSED';
                break;
              case '未完成':
                map.status = 'UNFINISHED';
                break;
              case '未下载':
                map.status = 'FINISHED';
                map.isDownload = false;
                break;
              case '已下载':
                map.isDownload = true;
                break;
              default:
                break;

            }
            delete map.status2;

          }

          //体检号
          if (map.checkId) {
            map.checkId = { contains: map.checkId };

          }
          //工作单位
          if (map.company) {
            map.company = { contains: map.company };

          }

          //卡号
          if (map.cardNumber) {
            map.cardNumber = { contains: map.cardNumber };

          }

          //姓名
          if (map.realName) {
            map.realName = { contains: map.realName };

          }

          //手机号
          if (map.mobile) {
            map.mobile = { contains: map.mobile };

          }

          //身份证号
          if (map.IDNumber) {
            map.IDNumber = { contains: map.IDNumber };

          }


        }





        rs.data.page = page;
        rs.data.pageSize = limit;
        map['isDelete'] = false;
        rs.data.total = await cardService.count(map);
        // console.log(map)
        data = await cardService.findByQuery(map, paginates, orderby);
        if (data) rs.data.items = data
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
      let count = await cardService.count({});
      data.cardNumber = extraTools.createCardNumber(8, count);
      data.password = extraTools.createPassword(6);
      let result = await cardService.addCardWithUserInfo(data);
      if (!!result) {
        rs.data = result
      } else {
        rs = commonConst.getFail();
        rs.error.message = Const.ASSESSCARD.CREATED_FAILED
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
    let map = this.req.body || {};
    let rs = commonConst.getSuccess();
    rs.data = commonConst.getResData();
    try {
      if (this.req.params.id) {
        map.id = this.req.params.id;
        let result = await cardService.remove(map);
        if (!!result) {
          rs.data = result
        } else {
          rs = commonConst.getFail();
          rs.error.message = Const.ASSESSCARD.ASSESSCARD_IS_NOT_EXIST
        }
      } else {
        let result = await cardService.removeDecide(map, this.req.session);
        if (result.res === 'SUCCESS') {
          rs.delStatus = true;
        } else {
          rs = commonConst.getWarning();
          rs.error.code = 556;
          rs.error.message = result.data;
        }


      }
    } catch (error) {
      rs = commonConst.getFail();
      rs.error.message = error.message

    }
    // var map = this.req.params.id;
    // var rs = commonConst.getSuccess();
    // try {
    //   let result = await cardService.remove(map);
    //   if (!!result) {
    //     rs.data = result
    //   } else {
    //     rs = commonConst.getFail();
    //     rs.error.message = Const.ASSESSCARD.ASSESSCARD_IS_NOT_EXIST
    //   }
    // } catch (error) {

    //   rs = commonConst.getFail();
    //   rs.error.message = error.message

    // }
    this.json(rs)
  }

  //更新
  async put() {
    let data = this.req.body;
    let rs = commonConst.getSuccess();
    try {
      let result;

      if (this.req.params.id && data.IDNumber) {
        //用于更新卡和用户表的用户信息
        let query = { id: this.req.params.id };
        result = await cardService.updateCustomerInfo(query, data)
      } else {
        //用于修改卡其他信息
        let query = { id: this.req.params.id };
        result = await cardService.update(query, data)
      }
      rs.data = result;
    } catch (error) {
      rs = commonConst.getFail();
      rs.error.message = error.message
    }
    this.json(rs)
  }
}
