/**
 * Created by zjp on 16/9/8.
 * 套餐表，保存用户的所有套餐
 */

module.exports = {
    schema: true,
    attributes: {
        centerId: {type: 'string', required: true},                 //科室ID
        isFixed: {type: 'boolean', defaultsTo: false},             //是否是固定套餐
        cardId: {type: 'string'},                                 //测评卡ID,固定套餐不填
        customerId: {type: 'string'},                             //用户ID,固定套餐不填
        name: {type: 'string'},                                   //套餐名称,固定套餐必填
        about: {type: 'string'},                                  //套餐简介,固定套餐必填
        items: {type: 'array'},                                   //体检项目
        total:{type:'float'},
        isDelete: {type: 'boolean'}
    }
};

/*

var items = {
    centerId: {type: 'string', required: true},
    isFixed: {type: 'boolean', defaultsTo: false},
    cardId: {type: 'string'},
    customerId: {type: 'string'},
    name: {type: 'string'},
    about: {type: 'string'},
    items: [{
        categoryName: {type: 'string', required: true},
        items: [{
            centerId: {type: 'string'}, // 科室ID
            categoryId: {type: 'string', required: true}, // 类别ID
            associateId: {type: 'string'}, // 关联关系ID
            categoryName: {type: 'string'}, // 类别名称
            itemName: {type: 'string', required: true}, // 项目名称
            place: {type: 'string'}, // 部位
            technology: {type: 'string'}, // 技术
            instrument: {type: 'string'}, // 仪器
            aliases: {type: 'string'}, // 别名
            englishName: {type: 'string'}, // 英文名称
            englishAbbreviations: {type: 'string'}, // 英文缩写
            isFasting: {type: 'boolean', defaultsTo: false}, // 是否空腹
            isSplit: {type: 'boolean', defaultsTo: false}, // 是否拆分指标
            precautions: {type: 'string'}, // 注意事项
            significance: {type: 'string'}, // 意义
            inPackageName: {type: 'string'}, // 套餐内名称
            price: {type: 'float'}, // 单价
            isBuy: {type: 'boolean', defaultsTo: false}, // 是否必须购买 默认否
            indicators: [{
                centerId: {type: 'string', required: true},
                categoryId: {type: 'string', required: true}, // 类别ID
                categoryName: {type: 'string', required: true}, //类别名称
                itemId: {type: 'string', required: true}, //项目Id
                itemName: {type: 'string', required: true}, // 项目名称
                name: {type: 'string', required: true}, //指标名称
                nameCenter: {type: 'string'}, //科室指标名称
                inPackageName: {type: 'string'}, // 套餐内名称
                uqnumber: {type: 'string', unique: true}, // 编号唯一(用户)
                associateId: {type: 'string'}, // 关联关系ID(内部系统关联)
                alias: {type: 'string'}, //别名
                nameEn: {type: 'string'}, //英文名称
                nameEnAbb: {type: 'string'}, //英文缩写
                dataType: {type: 'string'}, //数据类型
                unit: {type: 'string'}, //单位
                unitEn: {type: 'string'}, //英文单位
                decimalDigits: {type: 'integer'}, //小数位数
                decimalDigitsMin: {type: 'integer'}, //数值范围最小值
                decimalDigitsMax: {type: 'integer'}, //数值范围最大值
                enum: {type: 'array'}, //枚举数值
                text: {type: 'string'}, //指标意义
                price: {type: 'float'}, // 单价
                isDelete: {type: 'boolean', defaultsTo: false} //  是否删除 默认否
            }]
        }]
    ]
}
}

//*/
