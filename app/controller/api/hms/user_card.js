/**
 * Created by zjp on 2016/7/11.
 */

import base from "./base";
import cardService from  '../../../service/hms/assess/card';
export default class extends base {

  async get() {
    let data = this.req.query;
    let statistics = await cardService.groupByAndSum(data);

    this.json(statistics);


  }
}
