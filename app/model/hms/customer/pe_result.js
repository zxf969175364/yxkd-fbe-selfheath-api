/**
 * Created by zhaojinpeng on 2016/6/13 0013.
 * 体检结果   Physical Examination Result
 *
 */


module.exports = {
    schema: true,
    attributes: {
        customerId:{type:'string',required:true},
        result:{type:'array'}
    }
};

/*

// 体检结果要根据指标设置定义的数据格式，有对应的数据格式。等到需要导入数据时再说。
var result = [

]

//*/