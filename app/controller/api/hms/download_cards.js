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

        map.batchId = this.req.params.id;
        let batchData = await batchService.findOne({ id: map.batchId }, this.req.session)
        console.log(batchData)
        console.log("batchData")
        logData.batchName = batchData.batchName;
        logData.logType = 'CARDLOG';

        data = await cardService.downloadCardsExcel(map);

      } else {
        logData.batchName = '导出测评信息';
        logData.logType = 'REPORTLOG';


        if (map.search) {
          // console.log(map)
          delete map.search;
          // console.log(map.search);
          // console.log(map.cardNumber);

          //测评卡创建时间区间
          if (map.createdAtStart || map.createAtEnd) {
            map.createdAt = {};
            map.createdAtStart ? map.createdAt[">="] = map.createdAtStart : "";
            map.createAtEnd ? map.createdAt["<="] = map.createAtEnd : "";
            delete map.createdAtStart;
            delete map.createAtEnd;
          }

          //测评卡体检时间区间
          if (map.checkDateStart || map.checkDateEnd) {
            map.checkDate = {};
            map.checkDateStart ? map.checkDate[">="] = map.checkDate : "";
            map.checkDateEnd ? map.checkDate["<="] = map.checkDate : "";
            delete map.checkDateStart;
            delete map.checkDateEnd;
          }

          //批次卡状态         
          if (map.status2) {
            switch (map.status2) {
              case '未使用':
                map.status = 'UNUSED';
                break;
              case '未完成':
                map.status = 'UNFINISHED';
                break;
              case '未下载':
                map.status = 'FINISHED';
                map.isDownload = false;
                break;
              case '已下载':
                map.isDownload = true;
                break;
              default:
                break;

            }
            delete map.status2;

          }

          //体检号
          if (map.checkId) {
            map.checkId = { contains: map.checkId };

          }
          //工作单位
          if (map.company) {
            map.company = { contains: map.company };

          }

          //卡号
          if (map.cardNumber) {
            map.cardNumber = { contains: map.cardNumber };

          }

          //姓名
          if (map.realName) {
            map.realName = { contains: map.realName };

          }

          //手机号
          if (map.mobile) {
            map.mobile = { contains: map.mobile };

          }

          //身份证号
          if (map.IDNumber) {
            map.IDNumber = { contains: map.IDNumber };

          }


        }
        console.log(map)
        data = await cardService.downloadCardsExcel(map, this.req.session);
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
        rs = commonConst.getFail();
        rs.error.message = Const.BATCH.BATCH_NOT_EXIST
        this.json(rs)
      }
    } catch (error) {
      rs = commonConst.getFail();
      rs.error.message = error.message

    }
    this.json(rs)
  }
}