/**
 * Created by hgs on 16/7/19.
 */

import base from './base'

import proService from '../../../service/hms/system/progress'
import pdfPicService from '../../../service/hms/report/download_pdf_pic'
import commonConst from '../../../utils/common'


// import cardService from '../../../service/hms/assess/card'
// import batchService from '../../../service/hms/assess/batch'
// // import batchService from '../../../service/hms/assess/batch'
// import LogService from '../../../service/hms/data_log'
// import commonConst from '../../../utils/common'
// import Const from '../../../utils/const/batch_const'
// import downloadFileConst from '../../../utils/const/downloadFile_const'
// import importExcel from '../../../service/hms/import_excel'
// //import extraTools from '../../../utils/tools'

export default class extends base {



  async post() {

    let data = {};
    let map = this.req.body || {};
    let rs = commonConst.getSuccess();
    rs.data = commonConst.resData;
    try {

      // let progress = await proService.create();
      // rs.data = progress.id;







        console.log("====")

        let result = await pdfPicService.downloadPdfs(map);
        if (result.res === 'SUCCESS') {
          rs.data = result.data;
        } else {
          rs = commonConst.getFail();
          rs.error.code = 555;
          rs.error.message = result.data;

        }

    

    } catch (error) {
      rs = commonConst.result.FAIL;
      rs.error.message = error.message

    }
    this.json(rs)
  }
}