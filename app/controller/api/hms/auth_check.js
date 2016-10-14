/**
 * Created by G on 2016/6/22 0022.
 */
import base from './base';
import userService from  '../../../service/hms/organizations/user';
import CONST from '../../../utils/common';

export default class extends base {
    async post () {
        'use strict';

        let res = CONST.getSuccess();

        try{
            
            res.data = await userService.authCheck(this.req.body);
                     
            this.req.session.permissions = res.data.permissions;
            this.req.session.isLogin = true;
            this.req.session.user = {};
            this.req.session.user.uid = res.data.userInfo.id;
            this.req.session.user.orgId = res.data.userInfo.orgID;
            this.req.session.user.roleType = res.data.userInfo.roleType;
            this.req.session.user.userName = res.data.userInfo.userName;
            switch (res.data.userInfo.roleType){
                case "AGENCY":
                    this.req.session.user.idType = "agencyId";
                    break;
                case "HOSPITAL":
                    this.req.session.user.idType = "hospital";
                    break;
                case "CENTER":
                    this.req.session.user.idType = "centerId";
                    break;
            }
        }catch(err){
            res = CONST.getFail();
            res.error.message = err.message;
        }
        this.json(res);
    }
}