/**
 * Created by ZXF on 2016/9/1.
 */

module.exports = {
    attributes: {
        exclusiveName: {type: 'string', required: true },                  // 互斥项目组名称
        exclusiveItems: {type: 'array', required: true },                  // 互斥项目组项目
        isDelete:{type:'boolean', defaultsTo: false},   // 是否删除 默认否
    }
};
