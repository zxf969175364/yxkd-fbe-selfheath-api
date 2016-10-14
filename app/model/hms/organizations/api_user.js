/**
 * Created by zjp on 16/10/11.
 */
module.export = {
    schema: true,
    attributes:{
        appkey:{type:'string',required:true,unique:true},
        secret:{type:'string',required:true},
        userId:{type:'string',},
        permissions:{type:'array'},
        isEnable:{type:'boolean'},
        isDelete:{type:'boolean'}

    }
};