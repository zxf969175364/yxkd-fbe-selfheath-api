/**
 * Created by ZXF on 2016/9/1.
 */

module.exports = {
    attributes: {
        categoryName: {type: 'string', required: true },                  // 类目名称
        isDelete:{type:'boolean', defaultsTo: false},   // 是否删除 默认否
    }
};
