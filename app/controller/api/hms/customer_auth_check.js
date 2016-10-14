/**
 * Created by G on 2016/6/23 0023.
 */
import base from './base';
import cardService from  '../../../service/hms/assess/card';
import commConst from '../../../utils/common';
import cardConst from '../../../utils/const/card_const';

export default class extends base {
    async post() {
        'use strict';
        console.log("===")
        let res = commConst.getSuccess();
        let data = this.req.body;
        console.log(data)
        if (!data.cardNumber) {
            res = commConst.getFail();
            res.error.message = cardConst.ASSESSCARD.NO_CARD_NUMBER;
        } else if (!data.password) {
            res = commConst.getFail();
            res.error.message = cardConst.ASSESSCARD.NO_PASSWORD;
            }else if (!data.captcha){
                res = commConst.getFail();
                res.error.message = cardConst.ASSESSCARD.NO_CAOTCHA;
        } else {
            console.log(this.req.session.captcha);
            if (this.req.session.captcha && data.captcha.toLowerCase() === this.req.session.captcha.toLowerCase()){
            try {
                res.data = await cardService.authCheck(this.req.body);
                this.req.session.isLogin = true;
                this.req.session.user = {};
                this.req.session.user.customerid = res.data.userInfo.id;
                this.req.session.user.cardId = res.data.cardInfo.id;
                this.req.session.orgInfo = res.data.orgInfo;

            } catch (error) {
                res = commConst.getFail();
                res.error.message = error.message;
            }
            }else{
                res = commConst.getFail();
                res.error.message = cardConst.ASSESSCARD.WRONG;
            }

        }
        console.log(res)
        this.json(res);
    }

    /**
     * 获取当前登录测评卡的信息。
     */
    async get() {
        let userInfo = this.req.session.user;
        let res = commConst.getSuccess();
        if (!userInfo) {
            res = commConst.getFail();
            res.error.message = cardConst.GET_USER_INFO_FAILED;
        } else {
            res.data = await cardService.findOne({ id: userInfo.cardId, isDelete: false });
        }
        this.json(res);
    }
}