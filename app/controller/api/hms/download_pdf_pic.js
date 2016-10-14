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



  async get() {

    let data = {};
    let map = this.req.query || {};
    let rs = commonConst.result.SUCCESS;
    rs.data = commonConst.getResData();
    try {

      let progress = await proService.create();
      rs.data = progress.id;

   

      if (this.req.params.id) {

        // map.batchId = this.req.params.id;
        // let batchData = await batchService.findOne({ id: map.batchId })

        // logData.batchName = batchData.batchName;
        // logData.logType = 'CARDLOG';

        // data = await cardService.downloadCardsExcel(map);

      } else {
       

        if (map.search) {
          // console.log(map)
          delete map.search;
          // console.log(map.search);
          // console.log(map.cardNumber);

          //完成日期 时间区间
          if (map.updatedAtStart || map.updatedAtEnd) {
            map.updatedAt = {};
            map.updatedAtStart ? map.updatedAt[">="] = _.moment(map.checkDateEnd).startOf('day').format('YYYY-MM-DD HH:mm:ss') : "";
            console.log(map.updatedAtEnd)
            map.updatedAtEnd ? map.updatedAt["<="] = _.moment(map.updatedAtEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss') : "";
            delete map.updatedAtStart;
            delete map.updatedAtEnd;
          }

          //测评卡体检时间区间
          if (map.checkDateStart || map.checkDateEnd) {
            map.checkDate = {};
            map.checkDateStart ? map.checkDate[">="] = _.moment(map.checkDateEnd).startOf('day').format('YYYY-MM-DD HH:mm:ss') : "";
            map.checkDateEnd ? map.checkDate["<="] = _.moment(map.checkDateEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss') : "";
            delete map.checkDateStart;
            delete map.checkDateEnd;
          }

          //工作单位
          if (map.company) {
            map.company = { contains: map.company };

          }

          //卡号
          if (map.cardNumber) {
            // map.cardNumber = { contains: map.cardNumber };
            map.cardNumber = map.cardNumber.split(",");


          }

          //姓名
          if (map.realName) {
            // map.realName = { contains: map.realName };
            map.realName = map.realName.split(",");


          }

          //手机号
          if (map.mobile) {
            // map.mobile = { contains: map.mobile };
            map.mobile = map.mobile.split(",");

          }

          //身份证号
          if (map.IDNumber) {
            // map.IDNumber = { contains: map.IDNumber };
            map.IDNumber = map.IDNumber.split(",");
          }


        }

        console.log("====")
       
        pdfPicService.creatZip(map, this.req.session, progress);

      }

    } catch (error) {
      rs = commonConst.result.FAIL;
      rs.error.message = error.message

    }
    this.json(rs)
  }
}