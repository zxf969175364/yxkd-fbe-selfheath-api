/**
 * Created by zjp on 16/8/1.
 */

import base from './base';
import CONST from '../../../utils/common';
import customerConst from '../../../utils/const/customer_const'
import cardService from '../../../service/hms/assess/card';

export default class extends base {

    async get() {
        let customerId = this.req.params.id;
        let res = CONST.getSuccess();
        if (!customerId) {
            res = CONST.getFail();
            res.error.message = customerConst.CUSTOMER.NO_NECESSARY_ARGS;
        } else {
            res.data = await cardService.getHistoryCard(customerId);
        }
        this.json(res);
    }
}