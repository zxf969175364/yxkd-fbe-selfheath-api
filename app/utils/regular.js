


export default{

    //验证身份证
    checkID: (str)=> {
        //15位身份证
        let rule1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
        //18位身份证
        let rule2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;
        let rule3 = /^[A|1-9]\d{5}[0-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[X|Y|0-9]$/;
        // return ((checkstr(str, rule1) || checkstr(str, rule2))); 
        return (checkstr(str,rule3));
    },


    //验证手机号
    checkMobile:(str)=>{
        let rule = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        return (checkstr(str,rule));
    },
    //验证性别
    checkSex:(str)=>{
        let rule = /^['男'|'女']$/ ;
        return (checkstr(str,rule));
    },
   //验证邮箱
    checkEmail:(str)=>{
        let rule = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return (checkstr(str,rule));
    },
    //验证身高
    checkHeigth:(str)=>{
        let rule = /[0-9]{3}$/;
        return (checkstr(str,rule));
    },
    //验证体重
    checkWeight:(str)=>{
        let rule = /[0-9]{2,3}$/;
        return (checkstr(str,rule));
    },
}

 var checkstr = (str,rule)=> {
        if(rule.test(str))
        {
            return true;
        }else{
            return false; 
        }        
 };