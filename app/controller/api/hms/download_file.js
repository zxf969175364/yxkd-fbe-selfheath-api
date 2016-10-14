/**
 * Created by hgs on 16/7/19.
 */

import base from './base'
import cardService from '../../../service/hms/assess/card'
import LogService from '../../../service/hms/data_log'
import commonConst from '../../../utils/common'
import CONST from '../../../utils/common';
import downConst from '../../../utils/const/downloadFile_const';
import importExcel from '../../../service/hms/import_excel'
import fs from 'fs';
//import extraTools from '../../../utils/tools'

export default class extends base {



    async get() {

        let res = CONST.getSuccess();
        try {
            if (this.req.params.id) {
                console.log(this.req.query)
                let fileType = this.req.query.fileType;
                let filePath = '';
                switch (fileType) {
                    case 'xls':
                        filePath = G.path.public + '/xls/' + this.req.params.id;
                        break;
                    case 'pdf':
                        filePath = G.path.public + '/pdf/' + this.req.params.id;
                        break;
                    case 'zip':
                        filePath = G.path.public + '/zip/' + this.req.params.id;
                        break;
                    default:
                        filePath = G.path.public + '/' + this.req.params.id;
                }
                console.error(filePath)

                if (fs.existsSync(filePath)) {
                    this.res.download(filePath, this.req.params.id);
                } else {
                    res = CONST.getFail();
                    res.error.message = downConst.NO_FILE;
                    this.json(res);

                }

            } else {
                res = CONST.getFail();
                res.error.message = downConst.NO_NECESSARY_ARGS;
                this.json(res);

            }

        } catch (error) {
            res = CONST.getFail();
            res.error.message = error.message;
            this.json(res);
        }




    }


    // //新增批次用户信息
    // async post() {
    //   let data = this.req.body;
    //   let rs = commonConst.getSuccess();
    //   try {
    //     let jsons = importExcel.sheetToJSON(this.req.file.path, '客户批量导入');


    //     let result = await cardsService.create(data, jsons);

    //     if (!!result) {
    //       rs.data = result
    //     } else {
    //       rs = commonConst.getFail();
    //       rs.error.message = Const.BATCH.CREATED_FAILED
    //     }
    //   } catch (error) {
    //     rs = commonConst.getFail();
    //     rs.error.message = error.message

    //   }
    //   this.json(rs)
    // }
}