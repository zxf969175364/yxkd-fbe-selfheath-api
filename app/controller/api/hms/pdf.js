/**
 * Created by zjp on 16/7/29.
 */
import base from './base';
import CONST from '../../../utils/common';
import cardService from '../../../service/hms/assess/card';
import cardConst from '../../../utils/const/card_const'
import fs from 'fs'
import path from "path";

export default class extends base {

    async get() {
        let res = CONST.getSuccess();
        let id = this.req.params.id;
        let dir = G.path.public + '/pdf/' + id;
        let fileList = fs.readdirSync(dir);
        console.log(fileList);
        let fileName = _.find(fileList, function (o) {
            return o.indexOf('.pdf') > -1;
        });
        let filePath = path.join(dir, fileName);
        let cardInfo = await cardService.findOne({id: id, isDelete: false});
        if (cardInfo){
            // let saveName = cardInfo.realName + '-' + cardInfo.cardNumber + '.pdf';
            if (fs.existsSync(filePath)){
                this.res.download(filePath);
            }else {
                res = CONST.getFail();
                res.error.message = cardConst.ASSESSCARD.FILE_NOT_EXIST;
                this.json(res);
            }
        }else {
            res = CONST.getFail();
            res.error.message = cardConst.ASSESSCARD.ASSESSCARD_IS_NOT_EXIST;
            this.json(res);
        }
    }
}
