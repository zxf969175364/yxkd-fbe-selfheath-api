/**
 * Created by hgs on 16/7/19.
 */

import base from './base'
import cardService from '../../../service/hms/assess/card'
import batchService from '../../../service/hms/assess/batch'
// import batchService from '../../../service/hms/assess/batch'
import LogService from '../../../service/hms/data_log'
import commonConst from '../../../utils/common'
import Const from '../../../utils/const/batch_const'
import downloadFileConst from '../../../utils/const/downloadFile_const'
import importExcel from '../../../service/hms/import_excel'
//import extraTools from '../../../utils/tools'

export default class extends base {



  async get() {

    let data = {};
    let map = this.req.query || {};
    let rs = commonConst.getSuccess();
    rs.data = commonConst.getResData();
    try {


      let logData = {
        operatorId: this.req.session.user.uId,
        operatorName: this.req.session.user.userName,
        batchName: '',
        batchCardNum: 0,
        successNum: 0,
        isSuccess: false,
        excelFileName: '',
        logType: 'CARDLOG',
        operationType: 'EXPORT',
        centerId: this.req.session.user.orgId
      }

      if (this.req.params.id) {

        // map.batchId = this.req.params.id;
        // let batchData = await batchService.findOne({ id: map.batchId })

        // logData.batchName = batchData.batchName;
        // logData.logType = 'CARDLOG';

        // data = await cardService.downloadCardsExcel(map);

      } else {
        logData.batchName = '测评数据管理';
        logData.logType = 'RESULTLOG';

        console.error(map)


        if (map.search) {
          // console.log(map)
          delete map.search;
          // console.log(map.search);
          // console.log(map.cardNumber);

          //完成日期 时间区间
          if (map.updatedAtStart || map.updatedAtEnd) {
            map.updatedAt = {};
            map.updatedAtStart ? map.updatedAt[">="] = map.updatedAtStart : "";
            console.log(map.updatedAtEnd)
            map.updatedAtEnd ? map.updatedAt["<="] = _.moment(map.updatedAtEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss') : "";
            delete map.updatedAtStart;
            delete map.updatedAtEnd;
          }

          //测评卡体检时间区间
          if (map.checkDateStart || map.checkDateEnd) {
            map.checkDate = {};
            map.checkDateStart ? map.checkDate[">="] = map.checkDateStart : "";
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
        console.error(map)
        let filename = Date.now() + Math.floor(Math.random() * 10);
        data = await cardService.downloadEvaluation(map, this.req.session, filename);

      }

      if (data) {
        // logData.batchName = '导出测评信息';
        logData.batchCardNum = data.num;
        logData.successNum = data.num;
        logData.excelFileName = data.filename;
        logData.isSuccess = true;
        LogService.addDataLogDao(logData);
        // this.res.download(data.filepath, data.filename);
        rs.data = data.filename;

      } else {
        // logData.batchName = '导出测评信息';
        LogService.addDataLogDao(logData);
        rs = commonConst.result.FAIL;
        rs.error.message = downloadFileConst.NO_DAGE;
        this.json(rs)
      }
    } catch (error) {
      rs = commonConst.result.FAIL;
      rs.error.message = error.message

    }
    this.json(rs)
  }
}