/**
 * Created by hgs on 16/7/21.
 *
 */

import base from './base'
//import orderService from '../../../service/hms/assess/batch'
import commonConst from '../../../utils/common'
import cardService from '../../../service/hms/assess/card'
import capacityService from '../../../service/hms/assess/capacity'

import orderService from '../../../service/hms/assess/order'


//预约列表
export default class extends base {



    async get() {
        let orderData = [];
        let capacityData = [];
        let map = this.req.query || {};
        let rs = commonConst.getSuccess();
        //rs.data = commonConst.getResData();
        try {


            if (this.req.params.id) {

                let querys = {};
                querys.centerId = this.req.query.id;
                querys.day = this.req.query.day || "7";
                orderData = await cardService.groupByOrderSum(querys);
                capacityData = await capacityService.findWithGroupBy(querys);
                if (orderData) rs.data.order = orderData;
                if (capacityData) rs.data.capa = capacityData;

                // let querys = {};
                // querys.centerId = this.req.params.id;
                // //querys.day = this.req.params.day || "7";
                // querys.checkDate = this.req.query.checkDate || "";
                // querys.checkArea = this.req.query.checkArea || "";



                // orderData = await cardService.find(querys);

                // if (orderData) rs.data.items = orderData;

            } else {
                let querys = {};
                querys.centerId = this.req.query.id;
                querys.day = this.req.query.day || "7";
                //orderData = await cardService.groupByOrderSum(querys);
                
                capacityData = await orderService.getOrderAndCapa(querys);
                // if (orderData) rs.data.order = orderData;
                if (capacityData) rs.data = capacityData;
            }

        } catch (error) {
            rs = commonConst.getFail();
            rs.error.message = error.message

        }
        this.json(rs)



    }
}