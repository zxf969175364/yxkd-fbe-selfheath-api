/**
 * Created by huangjun on 16/6/7.
 *
 */


import questionDao from '../../dao/hms/basic/questions'
import Const from '../../utils/const/question_const'

export default {
  /**
   * 新增问题
   * @param question
   * @returns {question}
   */
  addQuestion: async function(question){
    'use strict';

    let query = {};
    query.questionName = question.questionName;
    let result = await questionDao.findOne(query);
    if(!!result){
      throw new Error(Const.QUESTION.QUESTION_IS_EXIST)
    }else {
      return questionDao.create(question)
    }
  },

  addQuestions: async function(questions){
    return questionDao.create(questions)
  },

  /**
   * 根据条件查询
   * @param query
   * @param paginates
   * @param orderby
   */
  findByQuery : async function(query,paginates,orderby){
    "use strict";
    query['isDelete'] = query['isDelete'] || false;
    return questionDao.findByQuery(query,paginates,orderby)
  },
  /**
   * 计算数量
   * @param query
   */
  count : async function(query){
    "use strict";
    return questionDao.count(query)
  },
  /**
   * 根据条件查询单个
   * @param query
   */
  findOne : async function(query){
    "use strict";
    query['isDelete'] = query['isDelete'] || false;
    return questionDao.findOne(query)
  },
  /**
   * 删除题目
   * @param questionId
   */
  remove : async function(questionId){
    "use strict";
    let result = await questionDao.findOne({id: questionId, isDelete: false});
    if(!result){
      throw new Error(Const.QUESTION.QUESTION_IS_NOT_EXIST)
    }else{
      return questionDao.remove(questionId)
    }
  },

  update: async function(query, data){
    'use strict';
    query.isDelete = false;
    let result = await questionDao.findOne(query);
    if (!result){
      throw new Error(Const.QUESTION.QUESTION_IS_NOT_EXIST);
    } else{
      return questionDao.update(query, data);
    }
  }
}