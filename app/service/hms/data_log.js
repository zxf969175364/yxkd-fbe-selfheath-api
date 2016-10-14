/**
 * Created by ZXF on 2016/8/12.
 */
import dataLogDao from '../../dao/hms/basic/data_log'

export default {
  /**
   * 新增测评数据日志
   * @param data
   * @returns {data}
   */
  addDataLogDao: async function (data) {
    'use strict';
    return dataLogDao.create(data);
  },
  
  /**
   * 根据条件查询
   * @param query
   * @param paginates
   * @param orderby
   */
  findByQuery : async function(query,paginates,orderby){
    'use strict';
    query['isDelete'] = query['isDelete'] || false;
    return dataLogDao.findByQuery(query,paginates,orderby)
  },
  /**
   * 计算数量
   * @param query
   */
  count : async function(query){
    'use strict';
    return dataLogDao.count(query)
  },
  /**
   * 根据条件查询单个
   * @param query
   */
  findOne : async function(query){
    'use strict';
    query['isDelete'] = query['isDelete'] || false;
    return dataLogDao.findOne(query)
  }
}