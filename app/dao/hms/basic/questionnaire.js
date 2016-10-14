/**
 * Created by tangtang on 16/6/13.
 */


export default {
  /**
   * 根据条件获取单个问卷
   * @param query
   */
  findOne : async function(query){
    return D.model('questionnaire').findOne(query).toPromise();
  },
  /**
   * 新增
   * @param questionnaire
   */
  create: async function (questionnaire) {
    'use strict';
    return D.model('questionnaire').create(questionnaire).toPromise();
  },

  /**
   * 根据条件查询
   * @param query
   * @param paginates
   * @param orderby
   */
  findByQuery: async function(query,paginates,orderby){
    'use strict';
    return D.model('questionnaire').find(query).paginate(paginates).sort(orderby).toPromise();

  },
  /**
   * 计算数量
   * @param query
   */
  count: async function(query){
    'use strict';
    return D.model('questionnaire').count(query).toPromise();
  },
  /**
   * 删除
   * @param questionnaireId
   */
  remove : async function(questionnaireId){
    'use strict';
    return D.model('questionnaire').update({id:questionnaireId},{isDelete: true}).toPromise()
  },

  update: async function(query, data){
    'use strict';
    return D.model('questionnaire').update(query, data).toPromise();
  }

}