/**
 * Created by zjp on 16/9/15.
 */

import base from "./base";
import packageService from '../../../service/hms/package/package';
import CONST from '../../../utils/common';
import packageConst from '../../../utils/const/package_const';

export default class extends base {

    async get() {
        let cardId = this.req.params.id;
        let res = CONST.getSuccess();
        if (!cardId) {
            res = CONST.getFail();
            res.error.message = packageConst.NO_CARD_ID;
        }else {
            res.data = await packageService.findOne({cardId: cardId});
        }
        this.json(res);
    }


}