/**
 * Created by zjp on 2016/6/29.
 * 用于保存性别与年领基本得分（信息）的model
 */
module.export = {
    scheme: true,
    attributes: {
        questionnaireId: {type: 'string', required: true},
        sectionName: {type: 'string', required: true},
        scores: {type: 'array', required: true},

    }
};

//scores 数据格式
/*{
    gender: {type: 'string', required: true},
    age: {type: 'integer', required: true},
    score: {type: 'float', required: true}
}*/
