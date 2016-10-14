/**
 * Created by zjp on 2016/6/24.
 * 疾病算分规则
 */

module.exports = {
    attributes:{
        diseaseID:{type:'string', required:true},
        questionnaireID:{type:'string', required:true},
        code:{type:'string', required:true},
        cases:{type:'array', required:true},
        relation:{type:'json'},
        result:{type:'json'}
    }
};


/*{
    "diseaseID": "",                 //疾病ID
    "questionnaireID": "",           //问卷Id
    "ruleType":"",                   //规则类型，标记该规则用于计算分值还是计算报告内容。
    "code":""                       //结果编号
    "cases": [
        {
            "caseName":"case1",
            "key":{
                "type":"",       //子条件指标类型,不同类指标对应表现形式不同，可能为某个某道题的结果，可能是一个计算公式、可能是一个名称
                "value":""      //子条件指标的具体值，与type对应
            },
            "relate":"",          //该字段用来描述子条件的key与result的对应关系。可能为≤≥＜＞＝≠
            "result":{
                "type":"",          //该字段用于描述value值的类型，不同类型对应value具体值数据类型不同。
                "value":""          //子条件结果的具体值。
            }
        },{
            "caseName":"case2",
            "key":{
                "type":"",       //子条件指标类型,不同类指标对应表现形式不同，可能为某个某道题的结果，可能是一个计算公式、可能是一个名称
                "value":""      //子条件指标的具体值，与type对应
            },
            "relate":"",          //该字段用来描述子条件的key与result的对应关系。可能为≤≥＜＞＝≠
            "result":{
                "type":"",          //该字段用于描述value值的类型，不同类型对应value具体值数据类型不同。
                "value":""          //子条件结果的具体值。
            }
        },{
            "caseName":"case3",
            "key":{
                "type":"",       //子条件指标类型,不同类指标对应表现形式不同，可能为某个某道题的结果，可能是一个计算公式、可能是一个名称
                "value":""      //子条件指标的具体值，与type对应
            },
            "relate":"",          //该字段用来描述子条件的key与result的对应关系。可能为≤≥＜＞＝≠
            "result":{
                "type":"",          //该字段用于描述value值的类型，不同类型对应value具体值数据类型不同。
                "value":""          //子条件结果的具体值。
            }
        }
    ],                     //子条件
    "relation": {
        "cond1":{
            "cond1":"case1",              //条件1
            "cond2":"case2",              //条件2
            "relate":""              //条件1与条件2的逻辑关系（and/or,not 的情况只一个条件）
        },                           //每个条件都可以是一个判断，
        "cond2":"case3",
        "relate":""

    },                              //子条件逻辑关系
    "result": {
        "type":"",                  //结果类型
        "value":""                  //结果值
    }                     // 条件对应的结果
}*/

//拿真实条件距离
// 高血压，a5的值
//1、 67题选“B”,68题选“B”或“C”或“D”,69题选“B”或“C”或“D”,则a5=2;
//2、 67题选“C”,68题选“B”或“C”或“D”,69题选“B”或“C”或“D”,70题选“A”,则a5=1.5;
//3、 67题选“D”,则a5=1"

// 分析如下:
// a5有三种得分情况，所以看作是三个条件、三个得分
// 拿条件1为例：
// 条件可拆分为三个子条件，通过三个子条件逻辑判断，得到最后的结果
// 三个子条件分别为
//  A. 67题选“B”
//  B. 68题选“B”或“C”或“D”
//  C. 69题选“B”或“C”或“D”
// 三个子条件的关系为 A&&B&&C
// 结果为：a5=2
//
// 整理条件结果为
//
// {
//     "caseName":"A",
//     "key":{
//         "type":"quersion",       //子条件指标类型,不同类指标对应表现形式不同，可能为某个某道题的结果，可能是一个计算公式、可能是一个名称
//         "value":"67"      //子条件指标的具体值，与type对应
//     },
//     "relate":"=",          //该字段用来描述子条件的key与result的对应关系。可能为≤≥＜＞＝≠
//     "result":{
//         "type":"answer",          //该字段用于描述value值的类型，不同类型对应value具体值数据类型不同。
//         "value":"B"          //子条件结果的具体值。
//     }
// }
// 以上标识条件 A 67题选B
// 同理可以整理出来B、C条件
// 接下来整理A&&B&&C
// 首先确定A与B的关系为 与
// 则有
// "cond1":{
//         "cond1":"A",              //条件1
//         "cond2":"B",              //条件2
//         "relate":"AND"              //条件1与条件2的逻辑关系（and/or,not 的情况只一个条件）
// },
// 标识A&&B
// 将得出的结果再与C整理关系得到
//
// "relation": {
//     "cond1":{
//             "cond1":"A",              //条件1
//             "cond2":"B",              //条件2
//             "relate":"AND"              //条件1与条件2的逻辑关系（and/or,not 的情况只一个条件）
//     },                           //每个条件都可以是一个判断，
//         "cond2":"C",
//         "relate":"AND"
//
// },
// 表示A&&B&&C
//
// 结果为分值则，最后的结果整理为
// "result": {
//         "type":"score",                  //结果类型
//         "value":"2"                  //结果值
// }