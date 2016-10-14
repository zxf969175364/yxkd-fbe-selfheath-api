/**
 * Created by ZXF on 2016/9/1.
 */

module.exports = {
    attributes: {
        centerId: { type: 'string' },                 // 科室ID
        categoryId: { type: 'string', required: true },               // 类别ID
        associateId: { type: 'string' },               // 关联关系ID
        categoryName: { type: 'string' },               // 类别名称
        itemName: { type: 'string', required: true },                 // 项目名称
        place: { type: 'string' },                                // 部位     aaaa,bbbbb
        technology: { type: 'string' },                           // 技术     aaaa,bbbbb
        instrument: { type: 'string' },                           // 仪器     aaaa,bbbbb
        aliases: { type: 'string' },                              // 别名
        englishName: { type: 'string' },                          // 英文名称
        englishAbbreviations: { type: 'string' },                 // 英文缩写
        isFasting: { type: 'boolean', defaultsTo: false },                // 是否空腹
        isSplit: { type: 'boolean', defaultsTo: false },                  // 是否拆分指标
        precautions: { type: 'string' },                          // 注意事项
        significance: { type: 'string' },                         // 意义
        inPackageName: { type: 'string' },            // 套餐内名称
        price: { type: 'float', defaultsTo: 0 },               // 单价
        isBuy: { type: 'boolean', defaultsTo: false },   // 是否必须购买 默认否
        isDelete: { type: 'boolean', defaultsTo: false }   // 是否删除 默认否
    }
};
