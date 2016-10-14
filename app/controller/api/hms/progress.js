/**
 * Created by hgs on 16/8/17.
 *
 */
import base from './base'
import batchService from '../../../service/hms/assess/batch'
import proService from '../../../service/hms/system/progress'
import commonConst from '../../../utils/common'
import proConst from '../../../utils/const/progress_const'
import extraTools from '../../../utils/tools'

export default class extends base {
  //在G.controller.rest已经处理了简单的增、删、改、查
  // 如果有复杂的使用，可以自己调用service处理
  //super.get() 直接调用默认的


  //获取问题信息(查询\列表\详情)
  async get() {

    let data = [];
    let map = this.req.query || {};
    let rs = commonConst.getSuccess();
    rs.data = commonConst.getResData();
    try {
      if (this.req.params.id) {
        // console.log(this.req.params.id)
        let proData = await proService.findOne({ id: this.req.params.id });
        // console.log(proData)
        if (proData) {
          rs.data = proData;
        } else {
          rs = commonConst.getFail();
          rs.error.message = proConst.PRO_NOT_EXIST;
        }


      } else {
        rs = commonConst.getFail();
        rs.error.message = proConst.ARGS_ERR;
      }
    } catch (error) {
      rs = commonConst.getFail();
      rs.error.message = error.message

    }

    this.json(rs)
  }


}
