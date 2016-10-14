/**
 * Created by zhaojinpeng on 2016/6/13 0013.
 * 预约容量分配
 */
module.exports = {
    attributes:{
        //batchId:{type:'string', required:true,unique:true},
        batchId:{type:'string', required:true},           //批次ID
        checkAreaName:{type:'string', required:true},           //体检区
        capaDate:{type:'date', required:true},          //日期
        capaNum: { type: 'integer' },                       //分配数量
        orderNum: { type: 'integer', defaultsTo: 0 },       //已预约数量
        



        agencyId:{type:'string', required:true},              //代理商id
        hospitalId:{type:'string', required:true},              //医院id
        centerId:{type:'string', required:true},              //科室id
        isDelete:{type:'boolean', defaultsTo:false},

       // checkStartDate:{type:'date'},                      //体检起始日期
       // checkEndDate:{type:'date'}                         //体检结束日期

    }
};