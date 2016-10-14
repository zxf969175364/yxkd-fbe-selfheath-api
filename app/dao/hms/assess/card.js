/**
 * Created by huangjun on 16/6/14.
 * 测评卡操作
 */

export default {
  /**
   * 新增测评卡
   * @param assessCard
   */
  create: async function (assessCard) {
    'use strict';
    return D.model('card').create(assessCard).toPromise();
  },

  /**
   * 根据条件查询
   * @param query
   * @param paginates
   * @param orderby
   */
  findByQuery: async function (query, paginates, orderby) {
    'use strict';
    query['isOld'] = query['isOld'] || false;
    return D.model('card').find(query).paginate(paginates).sort(orderby).toPromise();

  },
  /**
   * 计算数量
   * @param query
   */
  count: async function (query) {
    'use strict';
    query = query || {};
    query['isDelete'] = query['isDelete'] || false;
    query['isOld'] = query['isOld'] || false;
    return D.model('card').count(query).toPromise();
  },
  /**
   * 查询单条数据
   * @param query
   */
  findOne: async function (query) {
    'use strict';
    query['isOld'] = query['isOld'] || false;
    return D.model('card').findOne(query);
  },
  /**
   * 删除测评卡
   * @param cardId
   */
  remove: async function (cardId) {
    'use strict';
    return D.model('card').update({ id: cardId }, { isDelete: true }).toPromise()
  },
  //真正的删除批次，回滚使用慎用
  destroy: async function (batchId) {
    'use strict';
    return D.model('card').destroy({ batchId: batchId }).toPromise()
  },
  /**
   * 更新测评卡信息
   * @param query
   * @param card
   */
  update: async function (query, card) {
    'use strict';
    query['isOld'] = query['isOld'] || false;
    return D.model('card').update(query, card).toPromise()
  },

  findWithGroupBy: async function (query, groupFiled, countFiled) {
    'use strict';
    query['isOld'] = query['isOld'] || false;
    return D.model('card').find(query).groupBy(groupFiled).sum(countFiled);
  },


  find: async function (query) {
    'use strict';
    query = query || {};
    query['isOld'] = query['isOld'] || false;
    
    return D.model('card').find(query).toPromise();
  },
  max: async function (query,maxFiled) {
    'use strict';
    // query['isOld'] = query['isOld'] || false;
    return D.model('card').find(query).max(maxFiled).toPromise();
  },

  countAll: async function(){
    'use strict';
    return D.model('card').count();
  }

}