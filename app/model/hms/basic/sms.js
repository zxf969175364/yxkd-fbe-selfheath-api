/**
 * Created by zjp on 16/8/17.
 * 发送短信记录,方便统计。
 */

module.exports = {
    schema:true,
    attributes: {
        agencyId: {type: 'string', required: true},     //代理商ID
        hospitalId: {type: 'string', required: true},   //医院ID
        centerId: {type: 'string', required: true},     //科室ID
        cardId: {type: 'string', required: true},       //测评卡ID
        phoneNumber: {type: "string", required: true},  //手机号
        message: {type: 'string', required: true},      //发送消息内容
        success: {type: 'boolean', required: true},     //发送成功与否
        reason:{type:'string'},                          //失败原因
        count:{type:'integer'}                          //用于统计的常数字段
    }
};