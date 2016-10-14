/**
 * Created by zjp on 16/7/23.
 */

import base from './base';
import QService from '../../../service/hms/questionnaire';
import CONST from '../../../utils/common';

export default class extends base {

    async post() {
        let data = this.req.body;
        console.log(data);
        let res = CONST.getSuccess();
        try {
            res.data = await QService.getAvailableQuestionnaire(data);
        } catch (err) {
            res = CONST.getFail();
            res.error.message = err.message;
        }
        this.json(res);
    }
}
