/**
 * Created by huangjun on 16/6/14.
 */

import custConst from './const/customer_const';

export default{

    /**
     * 创建测评卡号
     * @param length
     * @param num
     * @returns {string}
     */
    createCardNumber: (length, num)=> {
        num = num + 1;
        let len = num.toString().length;
        let tag = '@';
        if (len > length) {
            num = 1;
            for (let i = 0; i < (len - length - 1); i++) {
                tag = tag + '@'
            }
        }
        let cardNumber = (Array(length).join(0) + num).slice(-length);
        return tag + cardNumber
    },
    /**
     * 创建旧测评卡号
     * @param length
     * @param num
     * @returns {string}
     */
    createOldCardNumber: (length, num)=> {
        num = num + 1;
        let len = num.toString().length;
        let tag = 'Old';
        if (len > length) {
            num = 1;
            for (let i = 0; i < (len - length - 1); i++) {
                tag = tag + '@Old'
            }
        }
        let cardNumber = (Array(length).join(0) + num).slice(-length);
        return tag + cardNumber
    },

    /**
     * 创建密码
     * @param length
     * @returns {*}
     */
    createPassword: (length) => {
        length = length / 2;
        let password = (Array(length).join(0) + Math.floor(Math.random() * 1000)).slice(-length)
            + (Array(length).join(0) + Math.floor(Math.random() * 1000)).slice(-length);
        return password;
    },

    /**
     * 转换查询条件
     * @param map
     * @returns {*}
     * @constructor
     */
    Query: (map) => {
        let query = map;
        query.isDelete = map.isDelete || false;
        delete query['order'];
        delete query['sort'];
        delete query['page'];
        delete query['pageSize'];
        return query;
    },


    /**
     * 网上找的验证并解析身份证的方法,  refer => http://bbs.csdn.net/topics/280063662#post-241335250
     * @param sId
     * @returns {*}
     */
    resolveID: (sId)=> {
        if (sId.startsWith("A")) {
            if (sId.length != 18) {
                return "Error: 身份证长度错误!"
            }
            let bGoodDay = _.moment(sId.substr(6, 8)).isValid();
            if (!bGoodDay) {
                return "Error: 非法生日";
            } else {
                // 检验 18 位身份证的校验码是否正确。
                // 校验位按照 ISO 7064:1983.MOD 11-2 的规定生成，X 可以认为是数字 10。
                var valsId;
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, i;
                for (i = 1; i < 17; i++) {
                    nTemp += sId.substr(i, 1) * arrInt[i];
                }
                valsId = arrCh[nTemp % 11];
                if (valsId != sId.substr(17, 1)) {
                    return "Error: 非法证号"
                }
            }
        } else {
            // 身份证正则表达式 (15 位)
            // let isIDCard1=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
            // 身份证正则表达式 (18 位)
            // let isIDCard2=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
            let aCity = {
                11: "北京",
                12: "天津",
                13: "河北",
                14: "山西",
                15: "内蒙古",
                21: "辽宁",
                22: "吉林",
                23: "黑龙江",
                31: "上海",
                32: "江苏",
                33: "浙江",
                34: "安徽",
                35: "福建",
                36: "江西",
                37: "山东",
                41: "河南",
                42: "湖北",
                43: "湖南",
                44: "广东",
                45: "广西",
                46: "海南",
                50: "重庆",
                51: "四川",
                52: "贵州",
                53: "云南",
                54: "西藏",
                61: "陕西",
                62: "甘肃",
                63: "青海",
                64: "宁夏",
                65: "新疆",
                71: "台湾",
                81: "香港",
                82: "澳门",
                91: "国外"
            };
            // let iSum = 0;

            sId = sId.toUpperCase();
            // 身份证号码为 15 位或者 18 位，15 位时全为数字，18 位前 17 位为数字，最后一位是校验位，可能为数字或字符 X。
            if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(sId))) {
                return "Error: 身份证长度错误!"
            }
            // 校验位按照 ISO 7064:1983.MOD 11-2 的规定生成，X 可以认为是数字 10。
            // 下面分别分析出生日期和校验位
            var len, re;
            len = sId.length;
            if (len == 15) {
                re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
                var arrSplit = sId.match(re);
                // 检查生日日期是否正确
                var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
                var bGoodDay;
                bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                if (!bGoodDay) {
                    return "Error: 非法生日";
                } else {
                    // 将 15 位身份证转成 18 位
                    // 校验位按照 ISO 7064:1983.MOD 11-2 的规定生成，X 可以认为是数字 10。
                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    var nTemp = 0, i;
                    sId = sId.substr(0, 6) + '19' + sId.substr(6, sId.length - 6);
                    for (i = 0; i < 17; i++) {
                        nTemp += sId.substr(i, 1) * arrInt[i];
                    }
                    sId += arrCh[nTemp % 11];
                }
            }
            if (len == 18) {
                re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                var arrSplit = sId.match(re);
                // 检查生日日期是否正确
                var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
                var bGoodDay;
                bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                if (!bGoodDay) {
                    return "Error: 非法生日";
                } else {
                    // 检验 18 位身份证的校验码是否正确。
                    // 校验位按照 ISO 7064:1983.MOD 11-2 的规定生成，X 可以认为是数字 10。
                    var valsId;
                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    var nTemp = 0, i;
                    for (i = 0; i < 17; i++) {
                        nTemp += sId.substr(i, 1) * arrInt[i];
                    }
                    valsId = arrCh[nTemp % 11];
                    if (valsId != sId.substr(17, 1)) {
                        return "Error: 非法证号"
                    }
                }
            }
        }
        // if (aCity[parseInt(sId.substr(0, 2))] == null)return "Error: 非法地区";
        // let sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
        let birthday = sId.substr(6, 4) + "-" + sId.substr(10, 2) + "-" + Number(sId.substr(12, 2));
        // let d = new Date(sBirthday.replace(/-/g, "/"));
        // if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()))return "Error: 非法生日";
        // for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
        // if (iSum % 11 != 1)return "Error: 非法证号";
        let customerInfo = {};
        // customerInfo.city = aCity[parseInt(sId.substr(0, 2))];
        customerInfo.birthday = birthday;
        customerInfo.gender = (sId.substr(16, 1) % 2 ? "男" : "女");
        return customerInfo;

    },


    /**
     * 根据生日、性别生成系统识别编码。 格式为 A ***** YYYYMMDD *** *
     * @param birthday  生日
     * @param gender    性别
     * @returns {string}    系统识别的编号,是否唯一性需到数据库中查询确认。
     */
    generateId: (birthday, gender) => {
        //以"A"为开头 8位 年 + 月 + 日    A ***** 2016 08 14 *** *
        let random = parseInt(Math.random() * 100000);
        random = '00000' + random;
        random = random.substring(random.length - 5, random.length);
        let id = "A" + random + _.moment(birthday).format('YYYYMMDD');
        //三位性别码      奇数为男、偶数为女
        let sexRandom = parseInt(Math.random() * 1000);
        if (gender === "男") {
            sexRandom = sexRandom % 2 == 1 ? sexRandom : sexRandom + 1;
        } else {
            sexRandom = sexRandom % 2 == 0 ? sexRandom : sexRandom + 1;
        }
        sexRandom = '000' + sexRandom;
        sexRandom = sexRandom.substring(sexRandom.length - 3, sexRandom.length);
        id += sexRandom;
        //基于身份证校验码,模仿身份证添加最后一位校验位
        var chickId;
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var nTemp = 0, i;
        for (i = 1; i < 17; i++) {
            nTemp += id.substr(i, 1) * arrInt[i];
        }
        chickId = arrCh[nTemp % 11];
        id = id + chickId;
        return id
    },


    /**
     * 通过生日计算用户真实年龄。
     * @param birthday
     * @returns {string}
     */
    calAge: (birthday) => {
        return _.moment().diff(_.moment(birthday), 'years', true).toFixed(1);
    },

    /**
     *
     * @param length
     */
    random: (length) => {
        var str = parseInt(Math.random() * Math.pow(10, length));
        var fixStr = "";
        for (var i = 0; i < length; i++) fixStr = fixStr + "0";
        str = fixStr + str;
        return str.substring(str.length - length, str.length);
    }
}