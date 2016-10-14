/**
 * Created by ZXF on 2016/8/12.
 * 测评数据日志
 */

module.exports = {
    attributes: {
        operatorId: {type: 'string'},                    // 操作人Id
        operatorName: {type: 'string'},                  // 操作人账号
        centerId: {type: 'string'},                      // 科室ID
        logType: {type: 'string'},                       // 操作模块: 测评卡日志 CARDLOG 测评报告日志 REPORTLOG 测评数据日志 RESULTLOG
        operationType: {type: 'string'},                 // 操作类型: 导入 IMPORT  导出 EXPORT
        excelFileName : {type: 'string'},                // 导入的文件名字
        batchName : {type: 'string'},                    // 批次名称
        batchCardNum : {type: 'integer'},                // 批次内卡的数量
        successNum: {type: 'integer'},                    // 导入|导出 实际成功数量
        isDelete:{type:'boolean', defaultsTo: false},   // 是否删除 默认否
        isSuccess:{type:'boolean', defaultsTo: true},   // 操作是否成功 默认是
    }
};
