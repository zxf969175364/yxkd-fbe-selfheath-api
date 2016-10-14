/*
 * @Author: hgs 
 * @Date: 2016-08-17 17:24:35 
 * @Last Modified by: hgs
 * @Last Modified time: 2016-09-13 17:27:22
 * 评测报告规则model
 */

module.export = {
    scheme: true,
    attributes: {
        questionnaireId: { type: 'string' },          //问卷ID
        totalNum: { type: 'integer' },          //总数量
        finishNum: { type: 'integer' },          //完成数量
        isFinished: { type: 'boolean', defaultsTo: false },                    //是否完成
        isSuccess: { type: 'boolean', defaultsTo: false },                //是否成功
        errArray: { type: 'array' },                       //错误集合
        isDelete: { type: 'boolean', defaultsTo: false },      //是否删除
        fileName: { type: 'string' },
        optData:{type:'json'},
    }
};


//errArray 数据结构
/*
[  
   {min:0,                         //分值范围下限
    max:0.14,                         //分值范围上限
    level:1,                     //等级
    levelName:"优",                  //等级名称
    desc:"恭喜您！这代表您目前的健康状况很不错！不存在不良躯体症状或心理问题，精神压力适可，睡眠质量也还可以，生活方式和作息习惯相对比较优良，同时，您有良好的健康素养，具有丰富的健康知识，希望您继续保持。"                        //对应的文字解释

}]
*/
