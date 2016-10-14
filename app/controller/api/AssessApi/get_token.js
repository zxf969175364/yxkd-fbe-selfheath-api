/**
 * Created by zjp on 16/10/10.
 */
import base from '../hms/base';
import CONST from '../../../utils/common';
import token from '../../../utils/token';
import apiUserService from '../../../service/hms/organizations/api_user';
import tokenConst from '../../../utils/const/token_const';


export default class extends base {

    async post() {
        let data = this.req.body;
        let type = this.req.params.type || 'json';
        let res = CONST.getAssessSuccess();
        console.log(data);
        if (!data || !data.apikey || !data.secret) {
            res = CONST.getAssessFail();
            res.message = tokenConst.ARGS_ERR;
            this.result(res, type);
        }
        let apiUserInfo = await apiUserService.findOne({apikey: data.apikey, secret: data.secret});
        console.log(apiUserInfo);
        if (!apiUserInfo) {
            res = CONST.getAssessFail();
            res.message = tokenConst.APIKEY_SERCET_ERR;
            this.result(res, type);
            return;
        }
        delete apiUserInfo.apikey;
        delete apiUserInfo.secret;
        let tokenString = await token.getToken(apiUserInfo);
        if (!tokenString) {
            res = CONST.getAssessFail();
            res.message = tokenConst.GET_TOKEN_ERR;
            this.result(res, type);
        }
        res.data = tokenString;
        this.result(res, type)

    }

};