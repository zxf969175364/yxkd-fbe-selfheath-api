/**
 * Created by zhaojinpeng on 2016/6/13 0013.
 * 批次model
 */
module.exports = {
    attributes: {
        //batchId:{type:'string', required:true,unique:true},
        batchName: { type: 'string', required: true },           //批次名称
        batchType: { type: 'string', required: true },           //批次类型 PERSONAL(散客)/GROUP(团体)
        totalCard: { type: 'integer', defaultsTo: 0 },
        // totalCard: { type: 'integer', required: true },          //该批次测评卡可预约数量
        totalNum: { type: 'integer', required: true },
        isDistribute: { type: 'boolean', defaultsTo: false },     //是否已分配完        

        usedCount: { type: 'integer', defaultsTo: 0 },                //已使用数量
        /*unfinishedCount:{type:'integer'},                     //未完成数量
        finishedCount:{type:'integer'},                         //已完成数量
        downloadCount:{type:'integer'},                         //已下载数量*/
        //上述四个字段可以使用，可以使用，不保存通过聚合查询得到。如果基于实现方便可以记录次数。
        // 如果基于数据准确性、功能修改同步考虑则使用聚合

        agencyId: { type: 'string', required: true },              //代理商id
        hospitalId: { type: 'string', required: true },              //医院id
        centerId: { type: 'string', required: true },              //科室id
        isDelete: { type: 'boolean', defaultsTo: false },

        checkStartDate: { type: 'date' },                      //体检起始日期
        checkEndDate: { type: 'date' }                         //体检结束日期

    }
};