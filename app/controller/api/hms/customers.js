/**
 * Created by huangjun on 16/6/20.
 *
 */
import base from './base'
import customService from '../../../service/hms/customer/customers'
import cardService from '../../../service/hms/assess/card'
import commonConst from '../../../utils/common'
import Const from '../../../utils/const/customer_const'
import extraTools from '../../../utils/tools'

export default class extends base {
  //在G.controller.rest已经处理了简单的增、删、改、查
  // 如果有复杂的使用，可以自己调用service处理
  //super.get() 直接调用默认的


//获取问题信息(查询\列表\详情)
  async get() {

    let data = []
    let map = this.req.query || {}
    let rs = commonConst.getSuccess()
    rs.data=commonConst.getResData()
    try{
      if (this.req.params.id) {
        map.id = this.req.params.id
        data = await customService.findOne(map)
        if(data) {
          delete data.password;
          delete data.updatedAt;
          delete data.id;
          rs.data = data;
        }else{
          rs= commonConst.getFail()
          rs.error.message = Const.CUSTOMER.CUSTOMER_IS_NOT_EXIST
        }
      } else{
        let order = this.req.query.order || 'id'
        let sort = this.req.query.sort || 'desc'
        let orderby = {}
        orderby[order] = sort

        let page = parseInt(this.req.query.page) || 1
        let limit = parseInt(this.req.query.pageSize) || 10
        let paginates = {
          page:page,
          limit:limit
        }
        map=extraTools.Query(map)
        rs.data.page = page
        rs.data.pageSize = limit
        rs.data.total = await customService.count(map)
        data = await customService.findByQuery(map,paginates,orderby)
        if(data) rs.data.items = data
      }
    }catch (error){
      rs= commonConst.getFail()
      rs.error.message = error.message

    }



    this.json(rs)
  }

  //新增客户
  async post() {
    let data = this.req.body
    let rs = commonConst.getSuccess()
    try {
      let result = await customService.create(data)
      if (!!result){
        rs.data = result
      }else {
        rs= commonConst.getFail()
        rs.error.message = Const.CUSTOMER.CREATED_FAILED
      }
    }catch (error){
      rs= commonConst.getFail()
      rs.error.message = error.message

    }
    this.json(rs)
  }

  //删除
  async delete () {
    //1. 检查参数
    //2. 直接调用super
    //super.delete()

    let map = this.req.params.id
    let rs = commonConst.getSuccess()
    try {
      let result = await customService.remove(map)
      if (!!result){
        rs.data = commonConst.DELETE_SUCCESS
      }else {
        rs= commonConst.getFail()
        rs.error.message = Const.CUSTOMER.DELETE_FATLED
      }
    }catch (error){
      rs= commonConst.getFail()
      rs.error.message = error.message

    }
    this.json(rs)
  }
  
  //更新
  async put(){
    let data = this.req.body;
    let rs = commonConst.getSuccess();
    try{
       if (data.cardId){
        let query = {id: data.cardId};
        rs.data = await cardService.updateCustomerInfo(query, data);
      }else {
        rs = commonConst.getFail();
        rs.error.message = Const.CUSTOMER.NO_NECESSARY_ARGS;
      }
    }catch(error){
      rs = commonConst.getFail();
      rs.error.message = error.message
    }
    this.json(rs)
  }
}
