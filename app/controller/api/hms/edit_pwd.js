/**
 * Created by zjp on 16/8/2.
 */

import base from './base';
import CONST from '../../../utils/common';
import userService from '../../../service/hms/organizations/user';

export default class extends base {

    async post() {
        let res = CONST.getSuccess();
        let data = this.req.body;
        if (data.userName && data.password && data.newPassword){
            try{
                await userService.edit_pwd(data);
                res.data = {"message":"修改密码成功!"}
            }catch(err){
                res = CONST.getFail();
                res.error.message = err.message;
            }
        }
        this.json(res);
    }
};