/**
 * Created by hgs on 2016/8/11  0022.
 */
import base from './base';
import userService from  '../../../service/hms/organizations/user';
import CONST from '../../../utils/common';

export default class extends base {
    async post () {
        'use strict';

        let res = CONST.getSuccess();

        try{
            res.data = '退出成功';
            this.req.session.destroy();
            // res.data = await userService.authCheck(this.req.body);
                     
            // this.req.session.permissions = res.data.permissions;
            // this.req.session.user = {};
            // this.req.session.user.uid = res.data.userInfo.id;
            // this.req.session.user.orgId = res.data.userInfo.orgID;
            // this.req.session.user.roleType = res.data.userInfo.roleType;
        }catch(err){
            res = CONST.getFail();
            res.error.message = err.message;
        }
        this.json(res);
    }
}