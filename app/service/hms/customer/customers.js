/**
 * Created by huangjun on 16/6/20.
 */

import customDao from '../../../dao/hms/customer/customers'
import cardService from '../assess/card'
import Const from '../../../utils/const/customer_const'
import tools from '../../../utils/tools'
import smsTemplate from '../../../utils/const/sms_template'
import smsService from '../sms'

export default {
  /**
   * 新增客户信息
   * @param data
   * @returns   {data}
   */
  create: async function (data) {
    'use strict'
    let query = {}
    query.IDNumber = data.IDNumber
    let result = await customDao.findOne(query)
    if (!!result) {
      throw new Error(Const.CUSTOMER.CUSTOMER_IS_EXIST)
    } else {
      return customDao.create(data)
    }
  },

  /**
   * 根据条件查询
   * @param query
   * @param paginates
   * @param orderby
   */
  findByQuery: async function (query, paginates, orderby) {
    'use strict'
    query['isDelete'] = query['isDelete'] || false
    return customDao.findByQuery(query, paginates, orderby)
  },
  /**
   * 计算数量
   * @param query
   */
  count: async function (query) {
    'use strict'
    return customDao.count(query)
  },
  /**
   * 根据条件查询单个
   * @param query
   */
  findOne: async function (query) {
    'use strict'
    query['isDelete'] = query['isDelete'] || false
    return customDao.findOne(query)
  },

  /**
   * 根据条件查询单个
   * @param query
   */
  findOneOld: async function (data, sess) {
    'use strict'
    let result = {};
    let query = {};
    query['isDelete'] = query['isDelete'] || false;
    query.IDNumber = data.IDNumber || '00';
    let idVali = tools.resolveID(query.IDNumber);

    let sendsmsFun = (customerData, sess) => {
      let random = parseInt(Math.random() * 10000);
      random = '00000' + random;
      random = random.substring(random.length - 4, random.length);
      result.IDcaptcha = random;
      console.error('=====发送==============')
      let smsMessage = smsTemplate.CHANGE_ID.replace("{科室名称}", sess.orgInfo.centerName).replace("{日期 + 时间点}", _.moment().format('YYYY-MM-DD HH:mm')).replace("{登录的网址}", '').replace("{验证码}", random);
      console.log(sess.orgInfo)
      let smsBasic = {
        agencyId: sess.orgInfo.agencyId,
        hospitalId: sess.orgInfo.hospitalId,
        centerId: sess.orgInfo.id,
        cardId: sess.user.cardId
      }
      console.log(smsBasic)
      console.error(smsMessage)
      console.error(customerData.mobile)
      smsService.sendSMS(smsBasic, customerData.mobile, smsMessage);

    }

    if (typeof idVali !== 'string') {
      //   console.error(data)
      let customerData = await customDao.findOne(query);

      console.log(customerData)
      if (customerData) {
        if (sess.user.IDcaptcha && sess.user.IDcaptchaTime && sess.user.IDNumber === query.IDNumber) {
          if (_.moment().diff(sess.user.IDcaptchaTime, 'm') < 30) {
            if (data.IDcaptcha) {
              if (sess.user.IDcaptcha === data.IDcaptcha) {
                console.log(customerData)
                result.data = customerData;
                // result.IDcaptcha = true
              } else {
                // result.IDcaptcha = false;
                result.err = Const.CUSTOMER.ERR_CAPTCHA;
              }
            } else {
              result.err = Const.CUSTOMER.EMPTY_CAPTCHA;
            }
          } else {
            sendsmsFun(customerData, sess);
            result.err = Const.CUSTOMER.TIME_OUT_CAPTCHA
          }


        } else {
          sendsmsFun(customerData, sess);

        }

      } //else {

      // }

    } else {
      result.err = Const.CUSTOMER.WRONG_ID;
    }

    return result;

  },

  findOrCreate: async function (search, data) {
    return customDao.findOrCreate(search, data)
  },
  /**
   * 删除题目
   * @param id
   */
  remove: async function (id) {
    'use strict';
    let result = await customDao.findOne({ id: id, isDelete: false })
    if (!result) {
      throw new Error(Const.CUSTOMER.CUSTOMER_IS_NOT_EXIST)
    } else {
      return customDao.remove({ id: id })
    }
  },
  /**
   * 修改个人信息接口。
   * @param id 客户ID
   * @param data 提交的数据。
   * @returns {*}
     */
  update: async function (query, data) {
    'use strict';
    let result = await customDao.findOne(query);
    if (!result) {
      throw new Error(Const.CUSTOMER.CUSTOMER_IS_NOT_EXIST)
    } else {
      delete data.id;
      let ID;
      //如果个人信息中已经有了身份证则使用原身份证进行解析,如果没有则使用提交的数据进行解析。
      // if (result.IDNumber){
      //   ID = result.IDNumber;
      // }else {
      //   ID = data.IDNumber;
      // }
      let basicInfo = tools.resolveID(data.IDNumber);
      console.log(basicInfo);
      if (typeof basicInfo === 'string') {
        throw new Error(Const.CUSTOMER.WRONG_ID);
      }
      data.gender = basicInfo.gender;
      data.age = tools.calAge(basicInfo.birthday);
      return customDao.update(query, data);
    }
  },

  /**
   * 创建系统自动生成且系统装不存在(唯一)的ID
   * @param birthday      生日
   * @param gender        性别(值为 男\女)
   * @returns {*|string}  系统识别以"A"开头且唯一的ID
     */
  createID: async function (birthday, gender) {
    'use strict'
    let newID = tools.generateId(birthday, gender);
    let idSum = await this.count({ IDNumber: newID });
    while (idSum > 0) {
      newID = tools.generateId(birthday, gender);
      idSum = await this.count({ IDNumber: newID });
    }
    return newID
  }
}
