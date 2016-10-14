/**
 * Created by huangjun on 16/6/21.
 *
 * 测评卡批次service
 */


import batchDao from '../../../dao/hms/assess/batch'
import cardDao from '../../../dao/hms/assess/card'
import Const from '../../../utils/const/batch_const'
import extraTools from '../../../utils/tools'


export default {
  /**
   * 新增批次
   * @param batch
   * @returns {batch}
   */
  create: async function (batch) {
    'use strict';
    let query = {};

    query.batchName = batch.batchName;
    query.centerId = batch.centerId;
    query.isDelete = false;
    let result = await batchDao.findOne(query);
    if (!!result) {
      throw new Error(Const.BATCH.BATCH_IS_EXIST)
    } else {
      let Batch = await batchDao.create(batch);
      // let count = await cardDao.countAll({}) || 0;
      let count = await cardDao.max({ cardNumber: { 'contains': '@' } }, 'cardNumber');
      if (count.length === 0) count = [{ cardNumber: '@0' }];
      count = parseInt(count[0]['cardNumber'].slice(1));

      let cards = [];
      for (let i = 0; i < parseInt(batch.totalNum); i++) {
        let card = {};

        card.cardNumber = extraTools.createCardNumber(8, count);
        card.password = extraTools.createPassword(6);
        card.batchName = batch.batchName;
        card.batchId = Batch.id;
        card.agencyId = Batch.agencyId;
        card.hospitalId = Batch.hospitalId;
        card.centerId = Batch.centerId;
        card.count = 1;

        count++;
        // console.log(card)
        cards.push(card);


      }
      // console.error("-------------")
      console.log(cards);
      await cardDao.create(cards);
      return Batch
    }
  },


  //查询未分配完批次
  findNotDistr: async function (query, paginates, orderby) {
    "use strict";
    query['isDistribute'] = query['isDistribute'] || false;
    query['isDelete'] = query['isDelete'] || false;
    return batchDao.findByQuery(query, paginates, orderby)
  },
  //查询已分配完批次
  findIsDistr: async function (query, paginates, orderby) {
    "use strict";
    query['isDistribute'] = query['isDistribute'] || true;
    query['isDelete'] = query['isDelete'] || false;
    return batchDao.findByQuery(query, paginates, orderby)
  },
  /**
   * 根据条件查询
   * @param query
   * @param paginates
   * @param orderby
   */
  findByQuery: async function (query, paginates, orderby) {
    "use strict";
    query['isDelete'] = query['isDelete'] || false;
    return batchDao.findByQuery(query, paginates, orderby)
  },

  findByQueryAndCount: async function (query, paginates, orderby) {
    "use strict";
    query['isDelete'] = query['isDelete'] || false;
    let batchData = await batchDao.findByQuery(query, paginates, orderby)

    let ids = _.map(batchData, 'id');

    let isUsed = await cardDao.findWithGroupBy({ status: 'FINISHED' }, ['batchId'], 'count');

    _.forEach(batchData, (data) => {
      let oneUsed = _.find(isUsed, (v) => {
        return v.batchId === data.id;
      })
      if (oneUsed) {
        data.usedCount = oneUsed.count;
      } else {
        data.usedCount = 0;
      }
    })

    return batchData;

  },
  /**
   * 计算数量
   * @param query
   */
  count: async function (query) {
    "use strict";
    return batchDao.count(query)
  },
  /**
   * 根据条件查询单个
   * @param query
   */
  findOne: async function (query) {
    "use strict";
    query['isDelete'] = query['isDelete'] || false;
    return batchDao.findOne(query)
  },

  /**
   * 更新
   * @param batch
   */
  update: async function (batch) {
    "use strict";
    let result = await batchDao.findOne({ id: batch.id });
    if (!result) {
      throw new Error(Const.BATCH.BATCH_NOT_EXIST)
    } else {
      let query = {};
      query.id = batch.id;

      delete batch['id'];
      let cardsResult = await cardDao.find({ batchId: query.id });
      if (cardsResult.length !== 0) {
        batch['batchName'] = batch.batchName || result.batchName;
        await cardDao.update({ batchId: query.id }, { batchName: batch.batchName });
      }
      return batchDao.update(query, batch)
    }


  },
  updateNum: async function (batchId, orderNum, count) {
    "use strict";
    let result = await batchDao.findOne({ id: batchId });
    if (!result) {
      throw new Error(Const.BATCH.BATCH_NOT_EXIST)
    } else {
      let query = {};
      query.id = batchId;

      let updateData = {
        totalNum: result.totalNum - count,
        totalCard: result.totalCard - orderNum

      }


      return batchDao.update(query, updateData)
    }
  },




  /**
   * 删除
   * @param id
   */
  remove: async function (id) {
    "use strict";
    let result = await batchDao.findOne({ id: id, isDelete: false });
    if (!result) {
      throw new Error(Const.BATCH.BATCH_NOT_EXIST)
    } else {
      return batchDao.remove(id)
    }
  },
  /**
 * 批量删除
 * @param id
 */
  removeDecide: async function (data, sess) {
    "use strict";

    let result = {
      res: '',
      data: ''
    }
    let errArray = [];

    data.data = JSON.parse(data.data);
    // console.error('-------')
    // console.log(data.data[0]);
    // console.log({ id: data.data, centerId: sess.user.orgId, isDelete: false })

    let batchResult = await batchDao.find({ id: data.data, centerId: sess.user.orgId, isDelete: false });
    // console.error('batchResult')
    // console.log(batchResult);

    if (!batchResult) {
      throw new Error(Const.BATCH.BATCH_NOT_EXIST)
    } else {

      try {
        let cardsQuery = {
          batchId: data.data,
          // centerId: sess.user.orgId,
          checkArea: { '!': [null, ''] },
          checkDate: { '!': [null, ''] },
          isDelete: false
        };
        let cards = await cardDao.find(cardsQuery);


        //删除确认
        if (cards.length === 0 || data.delStatus === '1') {
          let updateData = {
            isDelete: true
          }



          await batchDao.update({ id: data.data }, updateData);
          let allcards = await cardDao.find({ batchId: data.data });
          if (allcards.length !== 0) {
            await cardDao.update({ batchId: data.data }, updateData);

          }

          result.res = 'SUCCESS';

          return result;
        } else {
          //遍历已预约的测评卡
          cards = _.groupBy(cards, (data) => {
            return data.batchId;
          })


          _.forEach(cards, (n, key) => {

            errArray.push({

              // batchName:N[0].batchName
              batchName: _.find(batchResult, (v) => {
                return v.id === key;
              }).batchName,
              message: Const.BATCH.IS_ORDER
            })

          })

          result.res = 'FAIL';
          result.data = errArray;


          return result;
        }

      } catch (error) {
        throw error;

      }





    }
  }




}