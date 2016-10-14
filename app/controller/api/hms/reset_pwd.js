/**
 * Created by zjp on 16/8/11.
 */
import base from './base';
import userService from '../../../service/hms/organizations/user';
import CONST from '../../../utils/common';
import userConst from '../../../utils/const/user_const'

export default class extends base {

    async get() {
        let id = this.req.params.id;
        let session = this.req.session.user;
        let res = CONST.getSuccess();
        console.log(session);
        if (!id) {
            res = CONST.getFail();
            res.error.message = userConst.NO_USER_ID;
        } else {
            let query = {id: id};
            let data = await userService.resetPassword(query, session);
            if (data.length > 0) {
                res.data = "重置密码成功"
            } else {
                res = CONST.getFail();
                res.error.message = userConst.RESET_PWD_FAILED;
            }
        }
        this.json(res);
    }
}