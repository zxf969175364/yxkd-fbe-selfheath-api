/**
 * Created by zhaojinpeng on 2016/6/13 0013.
 * 问题model
 */
module.exports = {
  schema: true,
  attributes: {
    questionType: {type: 'string', required: true},  //问题类型  单选:SINGLE_CHOICE、多选:MULTI_CHOICE、填空:BLANKS
    questionName: {type: 'string', required: true},  //题干
    questionSer: {type: 'string', required: true},    //题目编号
    // parentId: {type: 'string'},                     //父级id, 可以为空                 暂时不用
    // level: {type: 'string', defaultsTo: '1'},        //题目等级,(区分子题,默认一级题目)    暂时不用,
    options: {type: 'array'},
    descInfo: {type: 'array'},                       //需要解释的名词 需要解释的名词可能会有多个。 见注视三,  后期由系统自动添加
    isDelete: {type: 'boolean', defaultsTo: false},
    constrains: {type: 'Array'}                       //限制条件, 数据格式见 注释二
  }
};

/**
 * options[{                                  //选项  选项名、图片、分值、建议
            optionTag:{type:'string'},          // A，B，C  1.2.3
            isMutex:{type:'boolean'}           //是否互斥
            optionName:{type:'string'},        //选项真实内容。
            optionType:{type:'string'},         //选项类型  文本(选项为固定文字):TEXT,输入(弹出文本框让用户输入):INPUT,时间(弹出时间选择让用户选择):TIME
            constrains:{type:'Array'},          //限制条件,数据格式见 注视二
            imageUrl:{type:'string'},
            descInfo:{type:'array'},            //同题干中的名词解释。
            child:{type:'json'}                    //某个选项的所有可能情况 {title:'', values:[]},貌似不用了,暂时留着
        }]
 */

//注释二
// constrains 数据结构
/*[
 {
 type:'sex',
 value:'man'
 },{
 type:'age',
 value:'20'
 }
 ]*/

//注视三
//名词解释
/*
 descInfo[{
 title:'',
 desc:''
 }]*/