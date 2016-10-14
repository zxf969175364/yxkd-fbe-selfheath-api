/**
 * Created by zjp on 16/7/19.
 * 名词解释 model
 */

module.exports = {
    attributes:{
        word:{type:'string', required:true},
        description:{type:'array'},
        isDelete:{type:'boolean', defaultsTo: false}
    }
};