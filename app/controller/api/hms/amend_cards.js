/**
 * Created by hgs on 16/8/2.
 */

import base from './base'
import cardsService from '../../../service/hms/assess/import_cards'
import commonConst from '../../../utils/common'
import Const from '../../../utils/const/batch_const'  
import importExcel from '../../../service/hms/import_excel'
//import extraTools from '../../../utils/tools'

export  default class extends base {

  
  //新增批次用户信息
  async post() {
    let data = this.req.body;
    let rs = commonConst.getSuccess();
    try {
        let jsons =  importExcel.sheetToJSON(this.req.file.path,'客户批量导入');
        
     
        let result = await cardsService.create(data,jsons);

        if (!!result){
          rs.data = result
        }else {
          rs = commonConst.getFail();
          rs.error.message = Const.BATCH.CREATED_FAILED
        }
      }catch (error){
        rs = commonConst.getFail();
        rs.error.message = error.message

      }
      this.json(rs)
    }
}