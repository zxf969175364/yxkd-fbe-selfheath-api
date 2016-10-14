/**
 * Created by huangjun on 16/6/21.
 *
 */
import base from '../base'
let model = new base('batch')

export default {
  /**
   * 新增
   * @param data
   */
  create: async function (data) {
    'use strict'
    return model.create(data);
  },

  find: async function (query) {
    'use strict';
    return model.find(query);
  },

  /**
   * 根据条件查询
   * @param query
   * @param paginates
   * @param orderby
   */
  findByQuery: async function (query, paginates, orderby) {
    'use strict'
    return model.findByQuery(query, paginates, orderby);

  },
  /**
   * 计算数量
   * @param query
   */
  count: async function (query) {
    'use strict'
    return model.count(query);
  },
  /**
   * 查询单条数据
   * @param query
   */
  findOne: async function (query) {
    'use strict'
    return model.findOne(query);
  },
  /**
   * 删除
   * @param query
   */
  remove: async function (query) {
    "use strict"
    return model.remove(query)
  },


  //真正的删除批次，回滚使用慎用
  destroy: async function (batchId) {
    'use strict';
    return D.model('batch').destroy({ id: batchId }).toPromise()
  },



  /**
   * 修改信息
   * @param query
   * @param data
   */
  update: async function (query, data) {
    "use strict"
    return model.update(query, data)
  }


}

