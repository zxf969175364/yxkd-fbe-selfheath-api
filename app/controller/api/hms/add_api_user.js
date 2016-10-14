/**
 * Created by zjp on 16/10/11.
 */

import base from './base';
import apiUserService from '../../../service/hms/organizations/api_user';
import CONST from '../../../utils/common'
import uuid from 'node-uuid'
import crypto from 'crypto';

export default class extends base {
    async post() {

        let res = CONST.getAssessSuccess();
        let data = this.req.body;
        let apiUserInfo = {};
        apiUserInfo.apikey = uuid.v4();
        apiUserInfo.secret = crypto.createHash('sha256').update(uuid.v4()).update(crypto.randomBytes(256)).digest('hex');
        if (data && data.userId){
            apiUserInfo.userId = data.userId;
        }
        res.data = await apiUserService.addUser(apiUserInfo);
        this.json(res);

    }
};