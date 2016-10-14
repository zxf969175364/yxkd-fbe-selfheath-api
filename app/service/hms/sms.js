/**
 * Created by zjp on 16/8/17.
 */

import smsDao from '../../dao/hms/basic/sms'
import sms from '../../utils/sms'
import smsConst from '../../utils/const/sms_const'
import cardService from './assess/card'
import orgService from './organizations/organization'
import smsTemplate from '../../utils/const/sms_template'

export default {

    /**
     * 向指定手机号发送特定信息,因系统暂时不涉及批量发送短信,暂时不支持批量发送
     * @param basicInfo     记录基本信息,组织信息(包括组织ID、医院ID、科室ID),测评卡ID
     * @param phoneNumber   要发送到的手机号
     * @param message       发送内容
     */
    sendSMS: async function (basicInfo, phoneNumber, message) {

        if (!basicInfo || !basicInfo.agencyId || !basicInfo.hospitalId || !basicInfo.centerId || !basicInfo.cardId) {
            throw new Error(smsConst.MISSING_BASIC_INFO);
        } else {
            let smsResult;
            let reason;
            try {
                smsResult = await sms.sendSMS(phoneNumber, message);
            } catch (err) {
                T.log('service/smstest_db.js', err);
                reason = err.message;
                smsResult = "false";
            }
            let data = {};
            data.agencyId = basicInfo.agencyId;
            data.hospitalId = basicInfo.hospitalId;
            data.centerId = basicInfo.centerId;
            data.cardId = basicInfo.cardId;
            data.phoneNumber = phoneNumber;
            data.message = message;
            data.success = smsResult.indexOf('success') > -1;
            data.reason = reason;
            return smsDao.create(data);
        }
    },
    sendCardsSMS: async function (map, sess) {        
        let cardIds = JSON.parse(map.data);        
        // let cardIds = map.data;
        let smsQuery = { cardId: cardIds };
        let groupBys = ['cardId'];
        let maxq = 'updatedAt';
        let smsData = await smsDao.findGroupByMax(smsQuery, groupBys, maxq);
        let cardsData = await cardService.find({ id: cardIds });
        let orgData = await orgService.findOne({ id: sess.user.orgId });
        let errArray = [];
        let result = {
            res: '',
            data: '',
            successNum: 0
        }
        // console.error("smsData")
        // console.log(smsData)

        // console.error("cardsData")
        // console.log(cardsData)

        // console.error("orgData")
        // console.log(orgData)


        let dateNow = _.moment();
        if (cardsData.length !== 0) {
            _.forEach(cardsData, (data) => {
                let cardSMS = _.find(smsData, (v) => {
                    return v.cardId === data.id;
                })
                // console.error(cardSMS)
                // console.error("=====")
                // console.log(dateNow.diff(cardSMS.updatedAt, 'm'))
                if (cardSMS && dateNow.diff(cardSMS.updatedAt, 'm') <= 15) {
                    let err = {
                        cardNumber: data.cardNumber,
                        data: smsConst.IS_SEND_15
                    }
                    errArray.push(err);
                } else {
                    //判断手机号是否为空
                    if (data.mobile && data.mobile !== '' && data.mobile !== null) {
                        let smsData = {
                            agencyId: data.agencyId,
                            hospitalId: data.hospitalId,
                            centerId: data.centerId,
                            cardId: data.id
                        }
                        let smsMessage = '';
                        //无预约权限
                        if (data.checkArea === null || data.checkArea === '') {
                            if (data.status === 'FINISHED') {
                                let err = {
                                    cardNumber: data.cardNumber,
                                    data: smsConst.NOT_ORDER_FINISH
                                }
                                errArray.push(err);
                            } else {
                                // smsMessage = `【康达云】${orgData.name}提醒您：请尽快以用户名${data.cardNumber}，密码${data.password}，登录 进行健康问卷测评，如有疑问请致电${orgData.telephone}。`;
                                smsMessage = smsTemplate.WARNING_FINISH_WITHOUT_PERM;
                            }
                        } else {
                            if (data.status === 'UNUSED' || data.status === 'UNFINISHED') {
                                // smsMessage = `【康达云】${orgData.name}提醒您：请尽快以用户名${data.cardNumber}，密码${data.password}，登录 完成健康测评和体检日期预约，如有疑问请致电${orgData.telephone}。`;
                                smsMessage = smsTemplate.WARNING_FINISH_WITH_PERM;
                            } else if (data.status === 'FINISHED' && data.isOrder) {
                                let err = {
                                    cardNumber: data.cardNumber,
                                    data: smsConst.ORDER_FINISH
                                }
                                errArray.push(err);
                            } else {
                                smsMessage = smsTemplate.WARNING_ORDER;
                            }
                        }
                        smsMessage = smsMessage.replace("{科室名称}", orgData.name).replace("{测评卡号}", data.cardNumber).replace("{测评卡密码}", data.password).replace("{科室网址}", '').replace("{科室电话}", orgData.telephone).replace("{科室电话}", orgData.telephone).replace("{科室电话}", orgData.telephone);

                        this.sendSMS(smsData, data.mobile, smsMessage)
                    } else {
                        let err = {
                            cardNumber: data.cardNumber,
                            data: smsConst.EMPTY_PHONE
                        }
                        errArray.push(err);
                    }
                }
            })

            console.error("errArray")
            console.log(errArray)


            if (errArray.length === 0) {
                result.res = 'SUCCESS';
                result.successNum = cardsData.length;

            } else {
                result.res = 'FAIL';
                result.data = errArray;
                result.successNum = cardsData.length - errArray.length;
            }




        } else {
            result.res = 'FAIL';
            result.data = smsConst.ARGS_ERR;
        }

        return result;



    }

}