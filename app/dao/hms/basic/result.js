/**
 * Created by huangjun on 16/6/14.
 */
export default {
  /**
   * 新增问卷实例
   * @param QAnswer
   */
  create: async function (QAnswer) {
    'use strict'
    return D.model('result').create(QAnswer).toPromise();
  },
  /**
   * 根据条件查询问卷实例
   * @param query
   * @param paginates
   * @param orderby
   */
  findByQuery: async function (query, paginates, orderby) {
    'use strict'
    return D.model('result').find(query).paginate(paginates).sort(orderby).toPromise();

  },
  /**
   * 计算数量
   * @param query
   */
  count: async function (query) {
    'use strict'
    return D.model('result').count(query).toPromise()
  },
  /**
   * 查询单条数据
   * @param query
   */
  findOne: async function (query) {
    'use strict'
    return D.model('result').findOne(query)
  },
  find: async function (query) {
    'use strict'
    return D.model('result').find(query)
  },
  /**
   * 删除
   * @param id
   */
  remove: async function (id) {
    'use strict'
    return D.model('result').update({ id: id }, { isDelete: true }).toPromise()
  },
  /**
   * 更新
   * @param query
   * @param data
   * @param option
   */
  update: async function (query, data, option) {
    'use strict'
    return D.model('result').update(query, data, option).toPromise()
  }


}