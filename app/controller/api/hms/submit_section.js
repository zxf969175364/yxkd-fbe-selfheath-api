/**
 * Created by zjp on 2016/7/5.
 */

import base from './base';
import calScore from '../../../service/hms/submit_section';
import commConst from '../../../utils/common';
import rConst from  '../../../utils/const/rule_const';

export default class extends base {

    async post() {
        let res = commConst.getSuccess();
        let data = this.req.body;
        let score;
        try {
            score = await calScore.calSectionScore(data);
        } catch (err) {
            res = commConst.getFail();
            res.error.message = err.message;
        }
        if (!!score && typeof score === "number") {
            try {
                res.data = await calScore.contentViaScore(data, score);
            } catch (err) {
                res = commConst.getFail();
                res.error.message = err.message;
            }
        } else {
            res = commConst.getFail();
            res.error.message = rConst.CALCULATE_SCORE_ERROR;
        }
        this.json(res);
    }
}