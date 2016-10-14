/**
 * Created by hgs on 16/7/19.
 */

import base from './base'
import cardsService from '../../../service/hms/assess/import_cards'
import LogService from '../../../service/hms/data_log'
import proService from '../../../service/hms/system/progress';
import commonConst from '../../../utils/common'
import Const from '../../../utils/const/batch_const'
import importExcel from '../../../service/hms/import_excel'
//import extraTools from '../../../utils/tools'

export default class extends base {


  //新增批次用户信息
  async post() {
    let data = this.req.body;
    let rs = commonConst.getSuccess();
    // let logData = {
    //   operatorId: this.req.session.user.uId,
    //   operatorName: this.req.session.user.userName,
    //   batchName: data.batchName,
    //   batchCardNum: 0,
    //   successNum: 0,
    //   isSuccess: false,
    //   excelFileName: '',
    //   logType: 'CARDLOG',
    //   operationType: 'IMPORT',
    //   centerId: this.req.session.user.orgId
    // }

    try {
      // console.log(this.req.files.file.path)


      let jsons = importExcel.sheetToJSON(this.req.files.file.path, '客户批量导入');

      let proData = {
        totalNum: jsons.length,
        isDelete: false,
        isFinished: false,
        isSuccess: false
      }
      let progress = await proService.create(proData);



      // let result = await cardsService.create(data, jsons, this.req.session);
      cardsService.create(data, jsons, this.req.session, progress);

      rs.data = progress.id;

      // if (result.res === 'SUCCESS') {        
      //   logData.batchCardNum = jsons.length;
      //   logData.successNum = jsons.length;
      //   logData.excelFileName = this.req.files.file.fieldname;
      //   logData.isSuccess = true;
      //   LogService.addDataLogDao(logData);
      //   // rs.data = result.data
      // } else {
      //   LogService.addDataLogDao(logData);
      //   rs = commonConst.getFail();
      //   rs.error.code = 555;
      //   rs.error.message = result.data;
      // }
    } catch (error) {
      // LogService.addDataLogDao(logData);
      rs = commonConst.getFail();
      rs.error.message = error.message

    }
    this.json(rs)
  }
}