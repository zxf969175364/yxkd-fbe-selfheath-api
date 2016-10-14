/**
 * Created by zjp on 16/9/13.
 */

import base from './base';
import CONST from '../../../utils/common';
import packageService from '../../../service/hms/package/package';

export default class extends base {

    async get() {
        let cardId = this.req.params.id;
        let res = CONST.getSuccess();
        // res.data = await packageService.getRecommendedPackage(cardId);
        res.data = await packageService.getRecommendedPackageWithAllItems(cardId);
        this.json(res);

    }
}