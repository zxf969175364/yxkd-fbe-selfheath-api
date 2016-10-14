/**
 * Created by zjp on 16/7/13.
 */

import base from './base';
import reportService from '../../../service/hms/report/report'
import reportConst from '../../../utils/const/report_const';
import CONST from '../../../utils/common';

export default class extends base {

    async post() {
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
    }

    async get() {
        let res = CONST.getSuccess();
        let id = this.req.params.id;
        let query = {cardId: id};
        console.log(query);
        let report = await reportService.findOne(query);
        if (!report){
            res = CONST.getFail();
            res.error.message = reportConst.NO_REPORT;
        }else {
            res.data = report;
        }
        this.json(res);
    }

}
