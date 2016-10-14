/**
 * Created by ZXF on 2016/8/12.
 */

export default {
  /**
   * 新增测评数据日志
   * @param QAnswer
   */
  create : async function(dataLog){
    'use strict';
    return D.model('data_log').create(dataLog).toPromise();
  },
  /**
   * 根据条件查询测评数据日志
   * @param query
   * @param paginates
   * @param orderby
   */
  findByQuery: async function(query, paginates, orderby){
    'use strict';
    return D.model('data_log').find(query).paginate(paginates).sort(orderby).toPromise();

  },
  /**
   * 计算数量
   * @param query
   */
  count: async function(query){
    'use strict';
    return D.model('data_log').count(query).toPromise()
  },
  /**
   * 查询单条数据
   * @param query
   */
  findOne: async function(query){
    'use strict';
    return D.model('data_log').findOne(query)
  },
  /**
   * 删除
   * @param id
   */
  remove : async function(id){
    'use strict';
    return D.model('data_log').update({id:id},{isDelete: true}).toPromise()
  },
  /**
   * 更新
   * @param query
   * @param data
   * @param option
   */
  update:async function(query,data,option){
    'use strict';
    return D.model('data_log').update(query,data,option).toPromise()
  }


}