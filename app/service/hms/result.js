/**
 * Created by huangjun on 16/6/14.
 */
import QAnswerDao from '../../dao/hms/basic/result'
import Const from '../../utils/const/result_const'
import  cardDao from '../../dao/hms/assess/card'


export default {
  /**
   * 新增问卷实例
   * @param data
   * @returns {data}
   */
  addQAnswer: async function (data) {
    'use strict';

    // let card = await cardDao.findOne({id:data.cardId})
    // if(!!card) {
    //   let personalInfo = {
    //     customerId: card.customerId,
    //     IDNumber: card.IDNumber,
    //     mobile: card.mobile,
    //     Tel: card.Tel,
    //     realName: card.realName,
    //     gender: card.gender,
    //     age: card.age,
    //     height: card.age,
    //     weight: card.weight,
    //     education: card.education,
    //     maritalStatus: card.maritalStatus,
    //     nationality: card.nationality,
    //     medicare: card.medicare,
    //     company: card.company,
    //     occupation: card.occupation
    //   }
    //
    //   data.personalInfo = personalInfo
    // }

    //查询是否应存在相同questionnaireId和cardNumbe的数据,存在更新,不存在创建
    let _result = await QAnswerDao.findOne({questionnaireId: data.questionnaireId, cardNumber: data.cardNumber});
    let cardInfo = await cardDao.findOne({cardNumber: data.cardNumber, isDelete:false});
    // let userInfo = await
      if(!!_result) {
        //查看是否存在该章节的结果,没有就插入
        data.agencyId = cardInfo.agencyId;
        data.hospitalId = cardInfo.hospitalId;
        data.centerId = cardInfo.centerId;
        if(!!data.finishSection && (_result.finishSection==data.finishSection)){
          throw new Error(Const.RESULT.SECTION_RESULT_IS_EXIST)
        }else {
          let section;
          if(!!data.section){
            if(!!_result.section){
              section = _result.section;
              section.push(data.section[0])
            }else {
              section =  data.section
            }
            let totalScore = _result.totalScore + data.totalScore;
            let item = await QAnswerDao.update({id: _result.id, isDelete: false}, {
              section: section,
              finishSection: data.finishSection,
              nextSection:data.nextSection,
              nextNumber:data.nextNumber,
              isFinished: data.isFinished,
              totalScore: totalScore
            });
            let cardData = {
              finishSection: data.finishSection,
              nextSection: data.nextSection,
              nextNumber:data.nextNumber,
            };
            if (data.isFinished){
              cardData.status = 'FINISHED';
            }else{
              cardData.status = 'UNFINISHED';
            }
            if (!!item && item.length == 1) {
              cardDao.update({cardNumber: data.cardNumber}, cardData);
              return item[0];
            } else {
              throw new Error(Const.RESULT.UPDATED_FAILED)
            }
          }
        }
      }else {
        let cardData = {
          finishSection: data.finishSection,
          nextSection: data.nextSection,
          nextNumber:data.nextNumber,
        };
        if (data.isFinished){
          cardData.status = 'FINISHED';
        }else{
          cardData.status = 'UNFINISHED';
        }
        cardDao.update({cardNumber: data.cardNumber}, cardData);
        return QAnswerDao.create(data)
      }





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
    return QAnswerDao.findByQuery(query,paginates,orderby)
  },
  /**
   * 计算数量
   * @param query
   */
  count : async function(query){
    'use strict';
    return QAnswerDao.count(query)
  },
  /**
   * 根据条件查询单个
   * @param query
   */
  findOne : async function(query){
    'use strict';
    query['isDelete'] = query['isDelete'] || false;
    return QAnswerDao.findOne(query)
  },
  /**
   * 删除题目
   * @param id
   */
  remove : async function(id){
    'use strict';
    let result = await QAnswerDao.findOne({id: id, isDelete: false});
    if(!result){
      throw new Error(Const.RESULT.RESULT_NOT_EXIST)
    }else{
      return QAnswerDao.remove(id)
    }
  },
  update: async function(query,data,option){
    'use strict';
    return QAnswerDao.update(query,data,option)
  }
}