/**
 * Created by zhaojinpeng on 2016/6/14 0014.
 * 疾病model
 * 
 */
module.exports = {
    attributes:{
        name:{type:'string', required:true},
        diseaseId:{type:'string', unique:true},
        ageRange:[{type:'string'}],   //string类型的数组
        chileOptions:{type:'array'},
        desc:{type:'json'},                  //问题选项描述 {title:'',content:''}
        isDelete:{type:'boolean', defaultsTo: false}
    }
};
