/**
 * Created by zjp on 16/8/23.
 */

import base from './base';
import srService from '../../../service/hms/rules/score_rule';
import CONST from '../../../utils/common';

export default class extends base {

    async get() {

        let id = this.req.params.id;

        let res = CONST.getSuccess();

        res.data = await  srService.getAllRulesName(id);
        this.json(res);

    }

}