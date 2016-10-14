/**
 * Created by zjp on 16/7/29.
 */

import base from './base';
import cardService from  '../../../service/hms/assess/card';
import commConst from '../../../utils/common';
import cardConst from '../../../utils/const/card_const';

export default class extends base {
    async post() {
        'use strict';
        let res = commConst.getSuccess();
        let data = this.req.body;
        if (!data.cardNumber) {
            res = commConst.getFail();
            res.error.message = cardConst.ASSESSCARD.NO_CARD_NUMBER;
        } else if (!data.phoneNumber){
            res = commConst.getFail();
            res.error.message = cardConst.ASSESSCARD.NO_PASSWORD;
        }else if (!data.captcha){
            res = commConst.getFail();
            res.error.message = cardConst.ASSESSCARD.NO_CAOTCHA;
        }else{
            if (this.req.session.captcha && data.captcha.toLowerCase() === this.req.session.captcha.toLowerCase()){
                try {
                    res.data = await cardService.findPassword(data.cardNumber, data.phoneNumber);
                    delete this.req.session.captcha;
                } catch (error) {
                    res = commConst.getFail();
                    res.error.message = error.message;
                }
            }else{
                res = commConst.getFail();
                res.error.message = cardConst.ASSESSCARD.WRONG;
            }

        }
        this.json(res);
    }
}