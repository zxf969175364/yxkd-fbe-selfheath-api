/**
 * Created by hgs on 16/7/21.
 *
 * 预约service
 */

import capacityDao from '../../../dao/hms/assess/capacity'
import orgDao from '../../../dao/hms/organizations/organizations'

import cardDao from '../../../dao/hms/assess/card'
import capacityConst from '../../../utils/const/capacity_const'
import batchService from '../../../service/hms/assess/batch'
import smsService from '../sms'
import smsTemplate from '../../../utils/const/sms_template'

export default {



  create: async function (datas) {
    'use strict';
    let addDatas = [];

    _.forEach(datas.data, (data) => {
      console.log(data)

      //let date = data.date;
      _.forEach(data.checkAreas, (area) => {
        addDatas.push({
          batchId: datas.batchId,
          checkAreaName: area.checkAreaName,
          capaDate: data.date,
          capaNum: area.num,
          agencyId: datas.agencyId,
          hospitalId: datas.hospitalId,
          centerId: datas.centerId
        })

      })
    });

    let capacities = capacityDao.create(addDatas);
    let upBatch = {};
    upBatch.id = datas.batchId;
    upBatch.isDistribute = "true";
    upBatch.checkStartDate = datas.checkStartDate;
    upBatch.checkEndDate = datas.checkEndDate;
    batchService.update(upBatch);

    let centerData = await orgDao.findOne({ id: datas.centerId });
    let cards = await cardDao.find({ batchId: datas.batchId })

    // console.log(cards);
    // console.error('======')
    // console.log(centerData)



    if (cards.length !== 0) {
      _.forEach(cards, (data) => {
        let smsData = {
          agencyId: data.agencyId,
          hospitalId: data.hospitalId,
          centerId: data.centerId,
          cardId: data.id
        }
        if (data.mobile !== '' && data.mobile !== null) {
          // let noOrderMessage = `【康达云】${centerData.name} 提醒您：以用户名${data.cardNumber}，密码${data.password}，登录 进行健康问卷测评和体检日期预约，如有疑问请致电${centerData.telephone}。`
          // let orderMessage = `【康达云】${centerData.name}提醒您：以用户名${data.cardNumber}，密码${data.password}，登录 进行健康问卷测评，如有疑问请致电${centerData.telephone}。`;

          // if (data.checkArea) {           
          //   smsService.sendSMS(smsData, data.mobile, orderMessage);
          // } else {            
          //   smsService.sendSMS(smsData, data.mobile, noOrderMessage);

          // }
          let smsMessage = '';
          if (data.checkArea !== '' && data.checkArea !== null) {
            smsMessage = smsTemplate.AFTER_ORDER_WITH_PERM;
          } else {
            smsMessage = smsTemplate.AFTER_ORDER_WITHOUT_PERM;
          }
          smsMessage = smsMessage.replace("{科室名称}", centerData.name).replace("{测评卡号}", data.cardNumber).replace("{测评卡密码}", data.password).replace("{科室网址}", '').replace("{科室电话}", centerData.telephone);
          smsService.sendSMS(smsData, data.mobile, smsMessage);



        }


      })
    }






    if (!!capacities) {
      return capacities;

    } else {
      throw new Error(capacityConst.CAPACITY.CREATED_FAILED);
    }


  },

  findWithGroupBy: async function (data) {
    'use strict';
    let start = _.moment().startOf('day').toISOString();
    let end = _.moment().add(data.day, 'days').endOf('day').toISOString();
    let query = {
      centerId: data.centerId,
      capaDate: {
        ">=": start,
        "<=": end
      }
    }
    query['isDelete'] = data['isDelete'] || false;
    let groupFiled = ['checkAreaName', 'capaDate'];
    let countFiled = data.sum;

    return capacityDao.findWithGroupBy(query, groupFiled, countFiled);
  },


  findWithGroupByVar: async function (data) {
    'use strict';
    let start = _.moment().startOf('day').toISOString();
    let end = _.moment().add(data.day, 'days').endOf('day').toISOString();
    let query = {
      centerId: data.centerId,
      capaDate: {
        ">=": start,
        "<=": end
      }
    }
    query['isDelete'] = data['isDelete'] || false;
    let groupFiled = ['checkAreaName', 'capaDate'];
    let countFiled = data.sum;

    return capacityDao.findWithGroupAndSortBy(query, groupFiled, countFiled, 'capaDate asc');
  },







  findGroupByArea: async function (query, countFiled) {
    'use strict';

    let groupFiled = ['batchId', 'checkAreaName'];
    // let countFiled = 'capaNum';
    query['isDelete'] = query['isDelete'] || false;
    return capacityDao.findWithGroupBy(query, groupFiled, countFiled);
  },



  find: async function (query) {
    'use strict';
    query['isDelete'] = query['isDelete'] || false;
    return capacityDao.find(query);

  },

  findByQuery: async function (query, paginates, orderby) {
    "use strict";
    query['isDelete'] = query['isDelete'] || false;
    return capacityDao.findByQuery(query, paginates, orderby);
  },


  //用户预约体检更新（体检区、体检时间 体检数量）
  userOrder: async function (data) {
    "use strict";
    let query = {
      batchId: data.batchId,
      capaDate: data.checkDate,
      checkAreaName: data.checkArea
    };
    query['isDelete'] = query['isDelete'] || false;
    let result = await capacityDao.findOne(query);
    if (!result) {
      throw new Error(capacityConst.CAPACITY.CAPACITY_NOT_EXIST)
    } else if ((result.capaNum <= result.orerNum)) {
      await cardDao.update({ cardNumber: data.cardNumber }, { checkDate: '' })
      throw new Error(capacityConst.CAPACITY.CAPACITY_NO_RESIDUC)
    } else {
      // delete data['cardNumber'];
      return await capacityDao.update(query, { orderNum: result.orderNum + 1 })

    }




  },




}

