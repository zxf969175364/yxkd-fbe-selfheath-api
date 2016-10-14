/*
 * @Author: hgs 
 * @Date: 2016-09-13 17:24:27 
 * @Last Modified by: hgs
 * @Last Modified time: 2016-09-13 18:14:49
 * 条件字段
 */

module.export = {
    shceme: true,
    attributes: {
        type: { type: 'string' },    // personalInfo 个人资料/questionResult 问题答案/questionnaireResult 问卷疾病等级
        name: { type: 'string' },
        filed: { type: 'array' },
        isDelete: { type: 'boolean', defaultsTo: false },      //是否删除
    }

}


// {
//     [{
//         nameEn: 'age',
//         name:'性别',
//         eum: 'num',          // NUM   CONDITION   数值类型  num 直接选择数值类型  codition  
//         condition:['>','<'],   //< <=  >  >=   true  false
//         value:['']                // 具体数值   男  女  1  2  3 等
//     }]
// }

