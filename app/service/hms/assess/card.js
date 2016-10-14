/**
 * Created by huangjun on 16/6/14.
 *
 * 测评卡service
 */


import cardDao from '../../../dao/hms/assess/card'
import resultDao from '../../../dao/hms/basic/result';
import reportDao from '../../../dao/hms/basic/report';
import Const from '../../../utils/const/card_const'
import customConst from '../../../utils/const/customer_const'
import customerService from '../../../service/hms/customer/customers'
import importExcel from '../../../service/hms/import_excel'
import reportService from '../report/report'
import orgService from '../organizations/organization'
import orgConst from '../../../utils/const/organization_const'
import batchService from '../assess/batch'
import smsConst from '../../../utils/const/sms_const'
import smsService from '../sms'
import smsTemplate from '../../../utils/const/sms_template'
import evaTemplate from '../../../utils/const/evaluations_template'
import tools from '../../../utils/tools'

import zipTool from '../../../utils/zip';

// import {spawn} from 'child_process'



export default {
  /**
   * 新增卡
   * @param card
   * @returns {card}
   */
  addCard: async function (card) {
    'use strict';
    let query = {};
    query.cardNumber = card.cardNumber;
    let result = await cardDao.findOne(query);
    if (!!result) {
      throw new Error(Const.ASSESSCARD.ASSESSCARD_IS_EXIST)
    } else {
      return cardDao.create(card);
    }
  },
  /**
   * 批量新增卡
   * @param card
   * @returns {card}
   */
  addCards: async function (cards) {
    'use strict';

    return cardDao.create(cards);

  },

  addCardWithUserInfo: async function (card) {
    'use strict';
    let query = {};
    query.cardNumber = card.cardNumber;
    let result = await cardDao.findOne(query);
    if (!!result) {
      throw new Error(Const.ASSESSCARD.ASSESSCARD_IS_EXIST)
    } else {
      let customerInfo = await customerService.findOne({ IDNumber: card.IDNumber });
      if (!customerInfo) {
        if (!card.IDNumber) {
          throw new Error(customConst.CUSTOMER.NO_IDNUMBER)
        }
        let customer = {};
        customer.IDNumber = card.IDNumber;
        customer.mobile = card.mobile;
        customer.realName = card.realName;
        customerInfo = await customerService.create(customer);
      }
      card.customerId = customerInfo.id;
      card.count = 1;
      let data = {};
      data.cardInfo = await cardDao.create(card);
      data.customerInfo = customerInfo;
      return data;
    }
  },

  //批量插入
  addCardsWithUserInfo: async function (cardNumbers, IDNumbers, datas) {
    'use strict';
    // let query = {};
    // query.cardNumber = card.cardNumber;
    // console.log(cardNumbers)
    // console.log(IDNumbers);
    // console.log(datas)
    let result = await cardDao.find({ cardNumber: cardNumbers });
    if (result.length !== 0) {
      throw new Error(Const.ASSESSCARD.ASSESSCARD_IS_EXIST)
    } else {

      let customersInfo = await customerService.findOrCreate(datas, datas);
      // console.log('customersInfo-------------------')
      // console.log(customersInfo)
      _.forEach(datas, function (v) {
        let customerid = _.result(_.find(customersInfo, { 'IDNumber': v.IDNumber }), 'id');
        if (customerid) {
          v.customerId = customerid;
        }
      })
      let data = {};
      // console.log('cards-------------------')
      // console.log(datas)
      data.cardInfo = await cardDao.create(datas);
      data.customerInfo = customersInfo;
      // console.log(data)
      return data;
    }
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
    let cards = await cardDao.findByQuery(query, paginates, orderby);

    cards = _.forEach(cards, function (data) {
      data.status2 = '未使用';
      if (data.status === 'UNUSED') {
        data.status2 = '未使用';
      } else if (data.status === 'UNFINISHED') {
        data.status2 = '未完成';
      } else if (data.status === 'FINISHED' && data.isDownload === false) {
        data.status2 = '未下载';
      } else {
        data.status2 = '已下载';
      }
    });

    return cards;
  },
  /**
   * 计算数量
   * @param query
   */
  count: async function (query) {
    "use strict";

    return cardDao.count(query)
  },

  /**
   * 计算数量
   */
  countNumber: async function () {
    let count = await cardDao.max({ cardNumber: { 'contains': '@' } }, 'cardNumber');

    if (count.length === 0) count = [{ cardNumber: '@0' }];

    return parseInt(count[0]['cardNumber'].slice(1));
  },

  /**
   * 根据条件查询单个
   * @param query
   */
  findOne: async function (query) {
    "use strict";
    query['isDelete'] = query['isDelete'] || false;
    return cardDao.findOne(query)
  },

  /**
   * 更新测评卡信息，必须明确修改什么,在前端检查
   * @param query
   * @param data
   */
  update: async function (query, data) {
    "use strict";
    query.isDelete = query.isDelete || false;
    let result = await cardDao.findOne(query);
    if (!result) {
      throw new Error(Const.ASSESSCARD.ASSESSCARD_IS_NOT_EXIST)
    } else {
      return cardDao.update(query, data)
    }
  },
  //用户预约体检更新（体检区、体检时间）
  userOrder: async function (data) {
    "use strict";
    let cardNumber = data.cardNumber;
    let result = await cardDao.findOne({ cardNumber: cardNumber });
    if (!result) {
      throw new Error(Const.ASSESSCARD.ASSESSCARD_IS_NOT_EXIST)
    } else if ((result.status !== "FINISHED")) {   //问卷是否已完成
      throw new Error(Const.ASSESSCARD.UNFINISHED)
    } else if (result.isOrder) {   //是否已预约
      throw new Error(Const.ASSESSCARD.ISORDER);
    } else {
      delete data['cardNumber'];
      return await cardDao.update({ cardNumber: cardNumber, isDelete: false }, data)

    }




  },
  /**
   * 更新用户信息
   * @param query
   * @param data
   * @returns {*}
   */
  updateCustomerInfo: async function (query, data) {
    "use strict";
    let cardNumber = data.cardNumber;
    query.isDelete = query.isDelete || false;
    data.isDelete = data.isDelete || false;
    let basicInfo = tools.resolveID(data.IDNumber);
    if (typeof basicInfo === 'string') {
      throw new Error(Const.CUSTOMER.WRONG_ID);
    }
    data.gender = basicInfo.gender;
    data.age = tools.calAge(basicInfo.birthday);
    let result = await cardDao.findOne(query);
    if (!result) {
      throw new Error(Const.ASSESSCARD.ASSESSCARD_IS_NOT_EXIST)
    } else {
      let q = {};
      q.or = [];
      if (data.customerId) {
        q.or.push({ customerId: data.customerId });
      }
      if (data.IDNumber) {
        q.or.push({ IDNumber: data.IDNumber });
      }
      if (q.or.length < 1) {
        throw new Error(Const.ASSESSCARD.ARGS_ERR);
      }

      let customer = await customerService.findOne(q);
      if (customer) {
        let cusQuery = { id: customer.id, isDelete: false };
        let customers = await customerService.update(cusQuery, data);
        customer = customers[0];
      } else {
        customer = await customerService.create(data);
      }
      data.customerId = customer.id;
      delete data['cardNumber'];
      delete data.password;
      let cardInfo = await cardDao.update(query, data);
      return cardInfo[0];
    }
  },
  /**
   * 删除
   * @param cardId
   */
  remove: async function (cardId) {
    "use strict";
    let result = await cardDao.findOne({ id: cardId, isDelete: false });
    if (!result) {
      throw new Error(Const.ASSESSCARD.ASSESSCARD_IS_NOT_EXIST)
    } else {
      return cardDao.remove(cardId)
    }
  },

  //批量删除测评卡
  removeDecide: async function (data, sess) {
    "use strict";

    let result = {
      res: '',
      data: ''
    }
    let errArray = [];
    let cardQuery = {
      id: JSON.parse(data.data),
      isDelete: false
    }

    let cardOrderQuery = {
      id: JSON.parse(data.data),
      checkDate: { '!': [null, ''] },
      isDelete: false
    }
    let error = [];
    // console.log(sess)

    //除超管外加入范围限制
    if (sess.user.roleType !== 'SUADMIN') {
      // cardQuery
      cardQuery[sess.user.idType] = sess.user.orgId;
      cardOrderQuery[sess.user.idType] = sess.user.orgId;
    }

    let cardsResult = await cardDao.find(cardQuery);
    let cardsOrderResult = await cardDao.find(cardOrderQuery);


    if (cardsResult.length === 0) {
      throw new Error(Const.ASSESSCARD.ASSESSCARD_IS_NOT_EXIST)
    } else {


      //删除确认
      if (cardsOrderResult.length === 0 || data.delStatus === '1') {
        cardsResult = _.groupBy(cardsResult, (data) => {
          return data.batchId;
        })


        _.forEach(cardsResult, (n, key) => {
          let orderNum = 0;
          let count = n.length;
          _.forEach(n, (data) => {
            !!(data.checkArea) ? orderNum++ : '';
          })

          let newQuery = _.map(_.filter(n, 'id'), 'id');

          // let updateQuery = { isDelete: true };
          cardDao.remove(newQuery);
          // console.log(orderNum)
          // if (orderNum) {
          batchService.updateNum(key, orderNum, count);
          // }


          // batchService.remove(n);        
        })
        result.res = 'SUCCESS';
        result.data = cardsResult;
        return result;
      } else {
        _.forEach(cardsOrderResult, (v) => {
          errArray.push({
            cardNumber: v.cardNumber,
            message: Const.ASSESSCARD.WRONG_ISORDER
          })
        })

        result.res = 'FAIL';
        result.data = errArray;
        return result;



      }

    }
  },
  authCheck: async function (data) {
    "use strict";
    let query = { cardNumber: data.cardNumber , isDelete: false};
    let cardInfo = await cardDao.findOne(query);
    if (!cardInfo || cardInfo.password !== data.password) {
      throw new Error(Const.ASSESSCARD.LOGIN_FAILED);
    } else {
      let q = { or: [{ id: cardInfo.customerId }, { IDNumber: cardInfo.IDNumber }] };
      console.log(q);
      let userInfo = await customerService.findOne({ or: [{ id: cardInfo.customerId }, { IDNumber: cardInfo.IDNumber }] }) || {};
      let orgInfo = await orgService.findOne({ id: cardInfo.centerId });
      // let org = {};
      // if (orgInfo) {
      //   org.province = orgInfo.province || "";
      //   org.city = orgInfo.city || "";
      //   org.district = orgInfo.district || "";
      //   org.name = orgInfo.name || '';
      // }
      let info = {};
      info.cardInfo = cardInfo;
      info.userInfo = userInfo;
      info.orgInfo = orgInfo;
      return info;
      // }
    }
  },

  // authCheck: async function (data) {
  //   "use strict";
  //   let query = { cardNumber: data.cardNumber };
  //   console.log(query);
  //   let cardInfo = await cardDao.findOne(query);
  //   if (!cardInfo || cardInfo.password !== data.password) {
  //     throw new Error(Const.ASSESSCARD.LOGIN_FAILED);
  //   } else {
  //     let q = { or: [{ id: cardInfo.customerId }, { IDNumber: cardInfo.IDNumber }] };
  //     console.log(q);
  //     let userInfo = await customerService.findOne({ or: [{ id: cardInfo.customerId }, { IDNumber: cardInfo.IDNumber }] }) || {};

  //     // let org = {};
  //     // if (orgInfo) {
  //     //   org.province = orgInfo.province || "";
  //     //   org.city = orgInfo.city || "";
  //     //   org.district = orgInfo.district || "";
  //     // }

  //     let info = {};
  //     info.cardInfo = cardInfo;
  //     info.userInfo = userInfo;
  //     // info.orgInfo = org;
  //     info.orgInfo = orgInfo;
  //     return info;
  //     // }
  //   }
  // },

  groupByAndSum: async function (data) {
    'use strict';
    let query = groupByQueryBuilder(data);
    let groupFiled = ['agencyId', 'hospitalId', 'centerId', 'status', 'isDownload'];
    let countFiled = 'count';
    return cardDao.findWithGroupBy(query, groupFiled, countFiled);
  },

  find: async function (query) {
    return cardDao.find(query);

  },
  //查询某个时间段内、按体检区、体检日期分组的数量
  groupByOrderSum: async function (data) {
    'use strict';
    let start = _.moment().startOf('day').toISOString();

    let end = _.moment().add(data.day, 'days').endOf('day').toISOString();

    let query = {
      //centerId: data.centerId,
      checkDate: {
        ">=": start,
        "<=": end
      }
    };

    let groupFiled = ["checkDate", "checkArea",];
    let countFiled = 'count';
    return cardDao.findWithGroupBy(query, groupFiled, countFiled);
  },
  //查询某个时间段内、按体检区、体检日期分组的数量
  groupByAreaSum: async function (data) {
    'use strict';
    // let start = _.moment().startOf('day').toISOString();

    // let end = _.moment().add(data.day, 'days').endOf('day').toISOString();

    let query = { batchId: data }

    let groupFiled = ['batchId', 'checkArea'];
    let countFiled = 'count';
    console.log(query)
    return cardDao.findWithGroupBy(query, groupFiled, countFiled);
  },
  //查询某个时间段内、按体检区、体检日期分组的card
  groupByOrderTal: async function (data) {
    'use strict';

    let query = {
      centerId: data.centerId,
      checkDate: {
        "!": null
      },
      batchId: data.batchId
    };
    console.log(query);

    let groupFiled = ["checkDate", "checkArea",];
    let countFiled = 'count';
    return cardDao.findWithGroupBy(query, groupFiled, countFiled);
  },
  //查询按体检区、体检日期分组的card
  sumBybatchTal: async function (data) {
    'use strict';

    let query = {
      batchId: data.batchId,
      checkDate: {
        "!": null
      }
    };

    let groupFiled = ["checkDate", "checkArea",];
    let countFiled = 'count';
    return cardDao.findWithGroupBy(query, groupFiled, countFiled);
  },

  downloadEvaluation: async function (query, sess, filename) {
    'use strict';
    query = query || {};
    if (sess.user.roleType !== 'SUADMIN') {
      query[sess.user.idType] = sess.user.orgId;
    }
    query['status'] = query['status'] || 'FINISHED';
    // query['isOld'] = query['isOld'] || true;


    let cardsData = await cardDao.find(query);
    // console.log(cardsData)
    if (cardsData.length === 0) {

    } else {

      let evaluations = [];

      let ids = _.map(cardsData, 'id');
      let resultData = await resultDao.find({ cardId: ids });
      // console.log(resultData)
      // console.log('resultData')


      let reportData = await reportDao.find({ cardId: ids });




      _.forEach(resultData, (data) => {
        let oneResult = {};

        let oneCard = _.find(cardsData, (v) => {
          return v.id === data.cardId;
        })
        oneResult.cardNumber = oneCard.cardNumber;
        oneResult.realName = oneCard.realName;
        oneResult.checkId = oneCard.checkId;
        oneResult.IDNumber = oneCard.IDNumber;
        oneResult.gender = oneCard.gender;
        oneResult.company = oneCard.company;
        oneResult.updatedAt = oneCard.updatedAt;
        oneResult.age = oneCard.age;
        oneResult.height = oneCard.height;
        oneResult.weight = oneCard.weight;

        oneResult.checkDate = oneCard.checkDate;
        oneResult.education = oneCard.education;
        oneResult.maritalStatus = oneCard.maritalStatus;
        oneResult.medicare = oneCard.medicare;
        oneResult.nationality = oneCard.nationality;
        oneResult.occupation = oneCard.occupation;
        oneResult.mobile = oneCard.mobile;
        oneResult.Tel = oneCard.Tel;
        oneResult.followUpType = oneCard.followUpType;
        oneResult.province = oneCard.province;
        oneResult.city = oneCard.city;



        if (reportData.length !== 0) {
          let oneReport = _.find(reportData, (v) => {
            return v.cardId === data.cardId;
          })
          // console.error(oneReport)
          if (oneReport) {
            _.forEach(oneReport.report.sections, (oneSection) => {
              if (oneSection.level) oneResult[oneSection.index + 'level'] = oneSection.level;
              oneResult[oneSection.index + 'score'] = oneSection.score;
            })

            _.forEach(oneReport.report.disease, (oneDisease) => {
              oneResult[oneDisease.index + 'dlevel'] = oneDisease.level;
              oneResult[oneDisease.index + 'dscore'] = oneDisease.score;
            })

            oneResult.level = oneReport.report.summary.level;
            oneResult.score = oneReport.report.summary.score;

          }


        }


        _.forEach(data.section, (section) => {
          //答案questions
          _.forEach(section.questions, (question) => {
            let oneQ = '';
            // let q3Flag = false;
            // let q4Flag = false;
            // console.error(question['questionSer'])
            if (question['questionSer'] === '0') {
              // console.error(question)
              // console.error('-=-=-=-=-=-=-=')
              if (question.answer.length === 0) {
                oneResult['q1'] = '否';
                oneResult['q3'] = '';
                oneResult['q4'] = '否';
              } else {
                oneResult['q1'] = '是';
                oneResult['q3'] = '';
                oneResult['q4'] = '否';
              }
              _.forEach(question.answer, (pepole) => {
                oneQ += pepole.relation + '：';
                // let q3PeploeFlag = false;

                // oneResult['q3'] += pepole.relation + '：';

                _.forEach(pepole.disease, (dis) => {
                  if (dis.questionSer === '1') {
                    oneQ += dis.option;
                    // q3PeploeFlag = true;
                  } else if (dis.questionSer === '2') {
                    oneResult['q3'] += pepole.relation + '：';
                    oneResult['q3'] += dis.option + '；';
                    // oneQ += 'M.恶性肿瘤；';
                    // q3Flag = true;
                  } else if (dis.questionSer === '3') {
                    let age = dis.age || "";
                    oneQ += dis.option + '|' + age + '；';
                    if ((pepole.relation === '父亲' && dis.age !== '55岁之后') || (pepole.relation === '母亲' && (dis.age !== '65岁之后'))) {
                      oneResult['q4'] = '是';
                    }

                  }


                })



              });


              // console.log(oneQ)
            } else {
              let qnum = question.answer.length;
              _.forEach(question.answer, (ans) => {
                qnum === 1 ? oneQ += ans.option : oneQ += ans.option + '；';
                // oneQ += ans.option + '；';
              })
              // oneResult[question.questionSer] = question.answer.join("");
            }
            // console.log(oneQ)
            oneResult[question.questionSer] = oneQ;
            // oneReport['a117'] = '';

          })

          //结果result
          // console.log(section.result)
          // let level = section.result.level || '';
          // let score = section.result.score || '';
          // oneResult[section.sectionName + 'level'] = level;
          // oneResult[section.sectionName + 'score'] = score;

          // _.forEach(section.result, (result) => {
          //   let level = result.level || '';
          //   let score = result.score || '';
          //   oneResult[section.sectionName + 'level'] = level;
          //   oneResult[section.sectionName + 'score'] = score;
          // })

        })


        evaluations.push(oneResult);
      })
      //模板
      let evaluaTemplate = evaTemplate.temp1;

      // let filename = Date.now() + Math.floor(Math.random() * 10);

      let data = {
        sheets: [{
          header: evaluaTemplate,
          items: evaluations,
          sheetName: 'sheet1',
        }],
        filepath: G.path.public + '/xls/' + filename + '.xlsx'
      };

      // let paras = ['a', '-t7z', G.path.public + '/zip/' + filename + '.7z'];
      let fileArray = [];
      let fileNums = Math.ceil(evaluations.length / 2000);
      //2000条分组
      for (let i = 0; i < fileNums; i++) {
        let start = i === 0 ? 0 : i * 2000 - 1;
        data.sheets[0].items = _.slice(evaluations, start, 2000)
        data.filepath = G.path.public + '/xls/' + filename + [i] + '.xlsx';
        await importExcel.writeExcle(data);
        // paras.push(data.filepath)
        fileArray.push(data.filepath);
      }
      // let filePathZip = G.path.public + '/zip/' + filename + '.7z';
      let filePathZip = filename + '.7z';
      // console.error(fileArray)

      let zipResult = await zipTool.creatZip(fileArray, filePathZip, 1);

      let result = {
        filepath: filePathZip,
        filename: filename + '.7z',
        num: evaluations.length
      };

      return result;

    }



  },

  //批量测评卡生成excel、下载
  downloadCardsExcel: async function (query, sess) {
    'use strict';
    let downType = query.downType;
    if (query.data) {
      query.id = JSON.parse(query.data);
      delete query.data;

    }


    delete query.downType;
    let batchCards = [
      { cardNumber: '测评卡号' },
      { password: '密码' },
      { realName: '姓名' },
      { gender: '性别' },
      { IDNumber: '身份证号' },
      { mobile: '手机' }
    ]
    let evaCards = [
      { cardNumber: '测评卡号' },
      { password: '密码' },
      { status2: '状态' },
      { realName: '姓名' },
      { gender: '性别' },
      { mobile: '手机' },
      { IDNumber: '身份证号' },
      { followUpType: '随访方式' },
      { checkArea: '体检区' },
      { checkId: '体检号' },
      { checkDate: '体检日期' },
      { company: '工作单位' },

    ]
    let downType3 = {
      'cardNumber': '测评卡号',
      'password': '密码',
      'realName': '姓名',
      'mobile': '手机',
      'IDNumber': '身份证号',
      'checkArea': '体检区',
      'checkId': '体检号',
      'checkDate': '体检日期',
      'company': '工作单位',
      'Email': '电子邮箱',
      'height': '身高(厘米)',
      'weight': '体重(千克)',
      'occupation': '职业',
      'education': '文化程度',
      'maritalStatus': '婚姻状况',
      'nationality': '民族',
      'medicare': '医保类型',
      'familyAddress': '家庭住址',
      'emergencyName': '紧急联系人',
      'emergencyTel': '紧急联系电话',
      'emergencyEmail': '紧急联系人邮箱'
    }


    
    if (sess && sess.user.roleType !== 'SUADMIN') {
      
      query.updatedAt = {
        '>=': _.moment().startOf('day').subtract(2, 'M').toISOString()
      }
    }
   
    

    let cards = await cardDao.find(query);
    

    let ever = () => {
      _.forEach(cards, function (data) {
        data.status2 = '未使用';
        if (data.status === 'UNUSED') {
          data.status2 = '未使用';
        } else if (data.status === 'UNFINISHED') {
          data.status2 = '未完成';
        } else if (data.status === 'FINISHED' && data.isDownload === false) {
          data.status2 = '未下载';
        } else {
          data.status2 = '已下载';
        }
      });

    }




    let filename = Date.now() + '.xlsx';

    let data = {
      sheets: [{
        header: [],
        items: cards,
        sheetName: 'sheet1',
      }],
      filepath: G.path.public + '/xls/' + filename
    };

    switch (downType) {
      case 'batchCards':
        data.sheets[0].header = batchCards;
        break;
      case 'evaCards':
        ever();
        data.sheets[0].header = evaCards;
        break;
      // case 'batchCards':
      //   data.sheets[0].header = batchCards;
      //   break;
    }

    try {
      await importExcel.writeExcle(data);
      let result = {
        filepath: data.filepath,
        filename: filename,
        num: cards.length
      };
      return result;

    } catch (error) {
      throw error;

    }

  },


  findPassword: async function (cardNumber, phoneNumber) {
    'use strict';
    let query = { cardNumber: cardNumber, mobile: phoneNumber, isDelete: false };
    let cardInfo = await cardDao.findOne(query);

    if (!cardInfo) {
      throw new Error(Const.ASSESSCARD.WRONG_PHONE_NUMBER);
    }
    let orgInfo = await orgService.findOne({ id: cardInfo.centerId });
    if (!orgInfo) {
      throw new Error(orgConst.ORG_NOT_EXIST)
    }
    let smsMessage = smsTemplate.FIND_PWD.replace("{科室名称}", orgInfo.name).replace("{测评卡密码}", cardInfo.password);

    // let smsMessage = orgInfo.name + "提醒您：您登录的密码为 " + cardInfo.password + "，请在首页进行登录，切勿告知他人。";
    let smsResult = {};
    let basicInfo = {};
    basicInfo.agencyId = cardInfo.agencyId;
    basicInfo.hospitalId = cardInfo.hospitalId;
    basicInfo.centerId = cardInfo.centerId;
    basicInfo.cardId = cardInfo.id;
    try {
      smsResult = await smsService.sendSMS(basicInfo, phoneNumber, smsMessage);
    } catch (err) {
      throw new Error(smsConst.FAIL + ":" + err.message);
    }
    if (!smsResult.success) {
      throw new Error(smsConst.FAIL + ":" + smsResult.reason);
    }
    return smsConst.SUCCESS;

  },

  getHistoryCard: async function (customerId) {

    let data = {};
    data = await customerService.findOne({ id: customerId, isDelete: false });
    data.cardInfo = await this.find({
      customerId: customerId,
      or: [{ status: 'UNFINISHED' }, { status: 'FINISHED' }],
      isDelete: false,
      sort:'updatedAt DESC'
    });
    let centerIDs = [];
    _.forEach(data.cardInfo, function (v1) {
      if (v1.updatedAt) {
        v1.updateTime = _.moment(v1.updatedAt).format('YYYY-MM-DD');
      }
      if (v1.checkDate) {
        v1.checkDate = _.moment(v1.checkDate).format('YYYY-MM-DD');
      }
      centerIDs.push({ id: v1.centerId });
      switch (v1.status) {
        case 'FINISHED':
          v1.st = "已完成";
          break;
        case 'UNFINISHED':
          v1.st = '未完成';
          break;
      }
    });
    let organizationInfo = await orgService.find(centerIDs);
    if (organizationInfo && organizationInfo.length > 0) {
      _.forEach(data.cardInfo, function (v2) {
        let org = _.find(organizationInfo, function (o2) {
          return o2.id === v2.centerId;
        });
        if (org) {
          v2.centerName = org.name || "";
          v2.hospitalName = org.hospitalName || "";
        } else {
          v2.centerName = "";
          v2.hospitalName = "";
        }
      });
    }
    data.reportInfo = await reportService.findOne({ cardId: customerId, isDelete: false });
    if (data.reportInfo && data.reportInfo.length > 0) {
      _.forEach(data.cardInfo, function (v) {
        let report = _.find(data.reportInfo, function (o) {
          return o.cardId === v.id;
        });
        v.reportId = report.id;
        v.questionnaireName = report.questionnaireName
      })
    }
    return data;
  },

  summary: async function (map) {

    let summary = {};
    let orgInfo = await orgService.findOne({ id: map.orgId });
    summary.orgCreatTime = orgInfo.createdAt;

    // let map = this.req.query;
    let result = {};
    let query = {};
    let org;
    let orgGFiled;
    switch (map.orgType) {
      case 'AGENCY':
        org = 'agencyId';
        orgGFiled = 'hospitalId';
        break;
      case 'HOSPITAL':
        org = 'hospitalId';
        orgGFiled = 'centerId';
        break;
      case 'CENTER':
        org = 'centerId';
        break;
    }
    query[org] = map.orgId;
    // delete map.orgType;
    // delete map.orgId;
    if (map.date && map.date_range) {
      let date_range = map.date_range;
      let range = 'year';
      if (date_range === "month") {
        range = 'year';
      } else if (date_range === 'day') {
        range = 'month'
      }
      let start = _.moment(map.date).startOf(range).toISOString();
      let end = _.moment(map.date).endOf(range).toISOString();
      query.updatedAt = {
        ">": start,
        "<=": end
      };

      // delete map.date_range;
      // delete map.date;
      //
      // console.log(map);

      console.log(query);
      let data = await this.find(query);
      let format;
      switch (date_range) {
        case 'month':
          format = 'YYYY-MM';
          break;
        case 'day':
          format = 'YYYY-MM-DD';
          break;
      }
      _.forEach(data, function (v) {
        v.updatedAt = _.moment(v.updatedAt).format(format);
        v.createdAt = _.moment(v.createdAt).format(format);
      });
      // let data = await cardDao.findWithGroupBy(map, groupFiled, 'count');
      // data = _.groupBy(data, 'status');
      // console.log(data.length);
      let data2 = _.groupBy(data, 'updatedAt');

      _.forEach(data2, function (v, k) {
        console.log(v.length);
        result[k] = {};
        // result[k].status = _.countBy(v, 'status');
        result[k].total = v.length;
        result[k].used = _.countBy(v, function (o) { return o.status !== 'UNUSED'; }).true ? _.countBy(v, function (o) { return o.status !== 'UNUSED'; }).true : 0;
        result[k].finished = _.countBy(v, function (o) { return o.status === 'FINISHED'; }).true ? _.countBy(v, function (o) { return o.status === 'FINISHED'; }).true : 0;
        result[k].download = _.countBy(v, 'isDownload').true ? _.countBy(v, 'isDownload').true : 0;
        // k.unused = _.countBy(v, 'status');
        // k.download = _.countBy(v, 'isDownload');
      });
    } else {
      let data = await this.find(query);
      let data2 = _.groupBy(data, orgGFiled);
      let ids = [];
      _.forEach(data2, function (v, k) {
        console.log(v.length);
        ids.push(k);
        result[k] = {};
        // result[k].status = _.countBy(v, 'status');
        result[k].total = v.length;
        result[k].used = _.countBy(v, function (o) { return o.status !== 'UNUSED'; }).true ? _.countBy(v, function (o) { return o.status !== 'UNUSED'; }).true : 0;
        result[k].finished = _.countBy(v, function (o) { return o.status === 'FINISHED'; }).true ? _.countBy(v, function (o) { return o.status === 'FINISHED'; }).true : 0;
        result[k].download = _.countBy(v, 'isDownload').true ? _.countBy(v, 'isDownload').true : 0;
        // k.unused = _.countBy(v, 'status');
        // k.download = _.countBy(v, 'isDownload');
      });
      let orgInfo = await orgService.find(ids);
      _.forEach(result, function (v, k) {
        v.name = _.find(orgInfo, function (o) {
          return k === o.id;
        }).name;
      });
    }
    summary.result = result;
    return summary;
  },


  summaryByMonth: async function (map, session) {

    let date = map.date || _.moment();
    let lastDay = _.moment(date).startOf('year').toISOString();
    let num = _.moment(date).endOf('year').month();
    let data = {};
    if (_.moment(map.date).year() == _.moment().year()) {
      num = _.moment().month() + 1;
      console.log(num);
    }
    let query = {};
    if (session.idType) {
      query[session.idType] = session.uid;
    }
    for (let m = 0; m < num; m++) {
      let endOfDay = _.moment(lastDay).add(1, "month").startOf('month').toISOString();
      let key = _.moment(lastDay).format("YYYY-MM");
      // let query = {
      query.updatedAt = {
        ">=": lastDay,
        "<": endOfDay
      };
      // };

      lastDay = endOfDay;
      let useInfo = await cardDao.findWithGroupBy(query, "status", "count");
      let downloadInfo = await cardDao.findWithGroupBy(query, "isDownload", "count");
      data[key] = {};
      let finished = _.find(useInfo, function (o) {
        return o.status === "FINISHED";
      });
      let unfinished = _.find(useInfo, function (o) {
        return o.status === "UNFINISHED";
      });
      let download = _.find(downloadInfo, function (o) {
        return o.isDownload;
      });
      data[key].used = 0;
      data[key].finished = 0;
      data[key].download = 0;
      if (finished) {
        data[key].used += finished.count;
        data[key].finished = finished.count;
      }
      if (unfinished) {
        data[key].used += unfinished.count;
      }
      if (download) {
        data[key].download = download.count;
      }
    }
    return data;
  },


  orgSummary: async function (map, session) {

    let result = {};
    let q1 = {};
    if (map.province) {
      q1.province = map.province;
    }
    if (map.city) {
      q1.city = map.city;
    }
    if (map.agencyId && !map.hospitalId) {
      q1.agencyId = map.agencyId;
    } else if (map.agencyId && map.hospitalId) {
      q1.agencyId = map.agencyId;
      q1.hospitalId = map.hospitalId;
    }
    if (map.search) {
      q1.name = { contains: map.search };
    }
    q1.isDelete = false;
    q1.roleType = map.orgType;
    let orgInfos = await orgService.find(q1);
    let orgIds = [];
    _.forEach(orgInfos, function (v) {
      orgIds.push(v.id);
    });

    let groupFiled = [];
    let queryKey;
    switch (map.orgType) {
      case "AGENCY":
        groupFiled.push("agencyId");
        queryKey = 'agencyId';
        break;
      case "HOSPITAL":
        groupFiled.push("hospitalId");
        queryKey = 'hospitalId';
        break;
      case "CENTER":
        groupFiled.push("centerId");
        queryKey = 'centerId';
        break;
    }

    let query = {};
    if (session.idType) {
      query[session.idType] = session.uid;
    }
    query[queryKey] = orgIds;
    let total = await cardDao.findWithGroupBy(query, groupFiled, 'count');
    let sortTotal = _.orderBy(total, ['count'], ['desc']);
    result.total = total.length;
    result.pageSize = parseInt(map.pageSize) || 10;
    result.page = parseInt(map.page) || 1;
    //手动进行分页
    console.log(result.pageSize * (result.page - 1));
    let sortInPage = sortTotal.slice(result.pageSize * (result.page - 1), (result.pageSize - 1) * result.page);

    // let ids = [];
    //
    // _.forEach(sortInPage, function (v) {
    //     ids.push(v[queryKey]);
    // });
    //
    // let q = {};
    // if (session.idType){
    //     q[session.idType] = session.uid;
    // }
    // q.id = ids;
    //
    // let infos = await orgService.find(q);

    groupFiled.push('status');
    groupFiled.push('isDownload');

    let idsGroupBy = await cardDao.findWithGroupBy(query, groupFiled, 'count');

    _.forEach(sortInPage, function (v) {
      v.used = 0;
      v.finished = 0;
      v.download = 0;
      v.total = v.count;
      delete v.count;
      _.forEach(idsGroupBy, function (v1) {
        if (v[queryKey] === v1[queryKey] && v1.status != "UNUSED") {
          v.used += v1.count;
        }
        if (v[queryKey] === v1[queryKey] && v1.status === "FINISHED") {
          v.finished += v1.count;
        }
        if (v[queryKey] === v1[queryKey] && v1.isDownload) {
          v.download += v1.count;
        }
      });
      _.forEach(orgInfos, function (v2) {
        if (v[queryKey] === v2.id) {
          v.name = v2.name;
        }
      })
    });
    result.items = sortInPage;
    return result
  },

  getCardNumber: async function(){
    let count = await cardDao.max({ cardNumber: { 'contains': '@' } }, 'cardNumber');
    if (count.length === 0) count = [{ cardNumber: '@0' }];
    count = parseInt(count[0]['cardNumber'].slice(1));

    return count;
  }
};


function groupByQueryBuilder(data) {
  let start = _.moment(data.date).startOf(data.date_range).toISOString();
  let end = _.moment(data.date).endOf(data.date_range).toISOString();
  let query = {
    updatedAt: {
      ">": start,
      "<=": end
    }
  };
  query[data.userType] = data.id;

  return query;

}