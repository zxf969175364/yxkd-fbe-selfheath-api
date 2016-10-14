/*
 * @Author: hgs 
 * @Date: 2016-10-12 14:17:26 
 * @Last Modified by: hgs
 * @Last Modified time: 2016-10-13 15:34:09
 */

import base from './base';
import reportService from '../../../service/hms/report/report'
import userService from '../../../service/hms/organizations/user'
import reportConst from '../../../utils/const/report_const';
import CONST from '../../../utils/common';

export default class extends base {


    async get() {
        // let res = CONST.getSuccess();
        // let id = this.req.params.id;

        let data = {};
        let map = this.req.query || {};
        let rs = CONST.getAssessSuccess();
        let format = this.req.query.format;

        if (!map.cardId) {
            rs = CONST.getAssessFail();
            rs.message = reportConst.NO_CARD_NUMBER;
        } else {
            let userData = await userService.findOne({ id: req.token.userId })
            let query = {
                cardId: map.cardId,
                centerId: userData.centerId
            };
            let report = await reportService.findOne(query);
            if (!report) {
                rs = CONST.getAssessFail();
                rs.message = reportConst.NO_REPORT;
            } else {
                rs.data = report;
            }
        }

        this.result(rs, format);
    }

    /*    async post() {
            let data = this.req.body;
    
            //TODO: 数据检查
            let res = CONST.getSuccess();
    
            if (!data.cardId) {
                res = CONST.getFail();
                res.error.message = reportConst.NO_CARD_NUMBER
            }else if (!data.questionnaireName) {
                res = CONST.getFail();
                res.error.message = reportConst.NO_QUESTIONNAIRE_NAME
            }else {
                try {
                    res.data = await reportService.getReport(data);
                } catch (err) {
                    res = CONST.getFail();
                    res.error.message = err.message;
                }
            }
            this.json(res);
        }*/


}
