/**
 * Created by zjp on 16/8/16.
 */

import base from './base';
import CONST from '../../../utils/common';
import customerService from '../../../service/hms/customer/customers'
import customerConst from '../../../utils/const/customer_const'

export default class extends base {

    async post() {
        //根据出生年月日生成系统识别的唯一编码
        let data = this.req.body;
        let res = CONST.getSuccess();
        if (data.birthday && data.gender){
            res.data = await customerService.createID(data.birthday, data.gender)
        }else {
            res = CONST.getFail();
            res.error.message = customerConst.CUSTOMER.NO_NECESSARY_ARGS;
        }
        this.json(res);
    }
}