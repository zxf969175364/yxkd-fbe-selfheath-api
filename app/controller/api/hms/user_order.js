/*
 * @Author: hgs 
 * @Date: 2016-07-25 10:50:08 
 * @Last Modified by: hgs
 * @Last Modified time: 2016-09-12 10:50:31
 */

import base from './base'
import orderService from '../../../service/hms/assess/order'
import cardService from '../../../service/hms/assess/card'
import capacityService from '../../../service/hms/assess/capacity'
import orgService from '../../../service/hms/organizations/organization'
import smsTemplate from '../../../utils/const/sms_template'


import smsService from '../../../service/hms/sms'
import commonConst from '../../../utils/common'
import cardConst from '../../../utils/const/card_const'
import extraTools from '../../../utils/tools'


//用户预约
export default class extends base {


    async get() {
        let data = [];
        let map = this.req.query || {};
        let rs = commonConst.getSuccess();
        rs.data = commonConst.getResData();
        try {
            if (this.req.params.id) {
                map.batchId = this.req.params.id;
                data = await orderService.getOrderList(this.req.session);
                if (data) {
                    rs.data = data;
                }
            }
        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message

        }
        this.json(rs)

    }

    async put() {
        let data = this.req.body;
        let rs = commonConst.getSuccess();
        let result = {}
        try {

            if (data.checkDate && data.batchId && data.cardNumber && data.checkArea && !_.isEmpty(data.checkDate) && !_.isEmpty(data.batchId) && _.isBoolean(data.isOrder) && !_.isEmpty(data.checkArea)) {
                let cardResult = await cardService.userOrder(data);
                let capaResult = await capacityService.userOrder(data);
                if ((!!capaResult) && (!!cardResult)) {
                    result.capa = capaResult;
                    result.card = cardResult;
                    let orgData = await orgService.findOne({ id: this.req.session.orgInfo.id });


                    let smsInfo = {
                        agencyId: cardResult.agencyId,
                        hospitalId: cardResult.hospitalId,
                        centerId: cardResult.centerId,
                        cardId: cardResult.id
                    }
                    if (cardResult.mobile !== '' && cardResult.mobile !== null) {
                        // let smsOrderMessage = `【康达云】${orgData.name}提醒您：您已成功预约${cardResult.checkDate}在${cardResult.checkArea}体检，如有疑问请致电${orgData.telephone}。`;
                        let smsOrderMessage = smsTemplate.ORDER_SUCCESS.replace("{科室名称}", orgData.name).replace("{体检日期}", cardResult.checkDate).replace("{体检区}", cardResult.checkArea).replace("{科室电话}", orgData.telephone);
                        smsService.sendSMS(smsInfo, cardResult.mobile, smsOrderMessage);
                    }

                    rs.data = result;
                } else {
                    rs = commonConst.getFail();
                    rs.error.message = cardConst.ASSESSCARD.ASSESSCARD_IS_NOT_EXIST;
                }
            } else {
                rs = commonConst.getFail();
                rs.error.message = cardConst.ASSESSCARD.ARGS_ERR;
            }

        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message;

        }
        this.json(rs)

    }
};
