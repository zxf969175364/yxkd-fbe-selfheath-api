/**
 * Created by G on 2016/6/13 0013.
 * 组织model
 */
module.exports = {
    schema: true,
    attributes: {
        organizationId:{type:'string',required:true,unique:true},    //组织编号,手动输入
        roleType: { type: 'string', required: true },                //组织类型,目前只有：AGENCY、HOSPITAL、CENTER
        name: { type: 'string', required: true },
        telephone: { type: 'string' },
        agencyId: { type: 'string' },
        agencyName: { type: 'string' },
        hospitalId: { type: 'string' },
        hospitalName: { type: 'string' },
        centerId: { type: 'string' },
        centerName: { type: 'string' },
        faxNumber: { type: 'string' },
        zipcode: { type: 'string' },
        logoUrl: { type: 'string' },
        contact: { type: 'string' },
        contactPhone: { type: 'string' },
        contactEmail: { type: 'string' },
        province: { type: 'string' },
        city: { type: 'string' },
        district: { type: 'string' },
        address: { type: 'string' },
        adminID: { type: 'string' },
        permissions: { type: 'array' },
        isEnable: { type: 'boolean', defaultsTo: true },
        isDelete: { type: 'boolean', defaultsTo: false },
        checkAreas: { type: 'array' },                        //array 结构见 注释一
        totalNum: { type: 'integer' },                        //日接待总量
        workWeek: { type: 'json' },                         //见注释二
        expelDate: { type: 'array' }                       //见注释三


    }
};



//注释一
/*
  [
      {
          checkAreaName:'asd',        //体检区名称
          checkNum:'44'，                //体检区容量
 ,

      }
  ]

//注释二

         workWeek:{
              Sunday:'true',
              Monday:'true',
              Tuesday:'true',
              Wendesday:'true',
              Thursday:'true',
              Friday:'true',
              Saturday:'false'
          }

//注释三

          expelDate:[{
              start:'2016-06-06',
              end:'2016-06-15',
          },
          {
              start:'2016-07-06',
              end:'2016-07-15',
          }]

*/