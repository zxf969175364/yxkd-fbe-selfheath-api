/**
 * Created by hgs on 2016/9/5.
 */

module.exports = {
    schema: true,
    attributes: {
        centerId: { type: 'string', required: true },                 // 科室ID  系统指标存为 SYSTEM
        categoryId: { type: 'string', required: true },               // 类别ID
        categoryName: { type: 'string', required: true },            //类别名称
        itemId: { type: 'string', required: true },                  //项目Id
        itemName: { type: 'string', required: true },                 // 项目名称
        name: { type: 'string', required: true },                   //指标名称
        nameCenter: { type: 'string' },                              //科室指标名称
        inPackageName: { type: 'string' },                          // 项目套餐内名称
        uqnumber: { type: 'string', unique: true },               // 编号唯一(用户)
        associateId: { type: 'string' },                              // 关联关系ID(内部系统关联)
        alias: { type: 'string' },                                    //别名
        nameEn: { type: 'string' },                                   //英文名称
        nameEnAbb: { type: 'string' },                                //英文缩写
        dataType: { type: 'string' },                                 //数据类型
        unit: { type: 'string' },                                     //单位
        unitEn: { type: 'string' },                                   //英文单位
        decimalDigits: { type: 'integer' },                           //小数位数
        decimalDigitsMin: { type: 'integer' },                        //数值范围最小值
        decimalDigitsMax: { type: 'integer' },                        //数值范围最大值
        enum: { type: 'array' },                                      //枚举数值
        text: { type: 'string' },                                     //指标意义
        price: { type: 'float', defaultsTo: 0 },                                     // 单价
        isDelete: { type: 'boolean', defaultsTo: false },             //  是否删除 默认否
        isSplit: { type: 'boolean', defaultsTo: false }                 // 是否拆分指标



    }
};
