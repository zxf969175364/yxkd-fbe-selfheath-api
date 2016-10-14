/**
 * Created by huangjun on 16/6/15.
 */
'use strict'
export default class {
  constructor (model){
    this.model = model;
  }
  /**
   * 新增
   * @param data
   */
 async create(data) {
    return D.model(this.model).create(data).toPromise();
  }

  /**
   * 根据条件查询
   * @param query
   * @param paginates
   * @param orderby
   */
  async findByQuery(query,paginates,orderby){
    return D.model(this.model).find(query).paginate(paginates).sort(orderby).toPromise();
  }

  /**
   * 计算数量
   * @param query
   */
   async count(query){
    return D.model(this.model).count(query).toPromise();
  }
  /**
   * 查询单条数据
   * @param query
   */
   async findOne(query){
    return D.model(this.model).findOne(query);
  }
  /**
   * 删除问题
   * @param id
   */
   async remove(id){
    return D.model(this.model).update({id:id},{isDelete: false}).toPromise()
  }

  /**
   * 修改题目信息
   * @param data
   */
   async update(data){
    let id = data.id
    delete data.id
    return D.model(this.model).update({id:id},data).toPromise()
  }

}