/**
 * Created by zjp on 16/8/17.
 */


import base from './base';
import commonConst from '../../../utils/common';
import customerService from '../../../service/hms/customer/customers'

export default class extends base {
    async post() {
        let data = this.req.body;
        let rs = commonConst.getSuccess();
        rs.data = {};
        // console.log(data)
        // console.log()
        // console.error(rs)
        console.log('=================')
        // res.data = await customerService.findOne({IDNumber: this.req.body.IDNumber});
        let result = await customerService.findOneOld(data, this.req.session);
        console.log(this.req.session)
        console.error(result)

        if (result.IDcaptcha) {
            this.req.session.user.IDNumber = data.IDNumber;
            this.req.session.user.IDcaptcha = result.IDcaptcha;
            this.req.session.user.IDcaptchaTime = _.moment();
            // console.log(this.req.session)
            rs = commonConst.getWarning();
            rs.error.message = '请输入验证码'
            // res = commonConst.result.

        } else if (result.err) {
            rs = commonConst.getFail();
            rs.error.message = result.err;

        } else {
            // console.log(result)
            if (result.data) rs.data = result.data;
            delete this.req.session.user.IDcaptcha
            delete this.req.session.user.IDcaptchaTime
            delete this.req.session.user.IDNumber

        }
        console.error(rs)
        this.json(rs)
    }
}