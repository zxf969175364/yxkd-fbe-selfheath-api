/**
 * Created by zhaojinpeng on 2016/6/13 0013.
 * 测评报告model
 */
module.exports = {
    attributes: {
        cardId:{type:'string', required:true},
        cardNumber: {type: 'string'},           //测评卡号
        questionnaireName: {type: 'string', required: true},        //问卷名称
        report: {type: 'json'}   //具体结构参照注视
    }
};

//report 数据结构
/*
{
    "reportType": "",
    "header": {
        "logo": "http://self-health.com/logo.jpg",
        "name": "解放军总医院健康管理中心",
        "footer": {},
        "addr": "北京市复兴路28号",
        "tel": "010-66985367",
    },
    "personalInfo": {
        "ID": "610124197602153971",
        "testTime": "2014-4-15",
        "name": "强东昌",
        "gender": "男",
        "age": "38.4"
    },
    "summary": {
        "level": 2,
        "levelName": "良好",
        "describe": "这在我们的5级评价中属于相对比较好的综合健康等级，但同时也提醒您还存在一些足之处，希望您参阅本报告的后续干预措施，不断地将自身健康维护好。"
    },
    "sections": [
        {
            "sectionName": "不良健康史",
            "score": 0.34,
            "level": 3,
            "levelName": "一般",
            "desc": "根据您填写的问卷结果，您存在一些不良健康史，包括：XXXX，请您重点关注，定期检查。"
        }, {
            "sectionName": "躯体症状",
            "score": 0.32,
            "level": 4,
            "levelName": "较差",
            "desc": "您存在如下躯体不适：XXX，请您重点关注"
        }, {
            "sectionName": "不良生活习惯",
            "score": 0.31,
            "level": 2,
            "levelName": "良好",
            "desc": "您存在一些不良生活习惯，包括：XXX。这些不良生活习惯可能会对您的健康造成一定的影响，请您尽量改变。"
        }, {
            "sectionName": "精神压力",
            "score": 0.43,
            "level": 3,
            "levelName": "较大",
            "desc": "您的精神压力较大，主要表现为：XXXX"
        }, {
            "sectionName": " 睡眠质量",
            "score": 0.29,
            "level": 3,
            "levelName": "良好",
            "desc": "您的睡眠质量一般，影响您睡眠的主要原因包括 XXXX"
        }, {
            "sectionName": " 健康素养",
            "score": 0.20,
            "level": 2,
            "levelName": "良好",
            "desc": "健康素养 Health Literacy，是指个体获取和理解基本健康信息和服务，并运用这些信息和服务做出正确的决策，以维护和促进自身健康的能力。您的健康素养较好。"
        }
    ],
    "disease": [
        {
            "diseaseName": "高血压",
            "define": "血压指血管内的血液对于单位面积血管壁的侧压力，即压强，通常所说的血压是指动脉血压；根据血压水平分为正常、正常高值血压和1、2、3级高血压；高血压是指收缩压≥140mmHg和（或）舒张压≥90mmHg；同时，健康管理中还根据血压水平、心血管危险因素、靶器官损害、临床并发症和糖尿病等将高血压患者分为低危、中危、高危和极高危四个水平；此外，高血压的诊断中还需要明确的是原发性还是继发性高血压。",
            "risk": "低危",
            "idealScore": 20,
            "actualScore": 7.84,
            "level": "您高血压的风险等级为中度风险，表明您有患高血压的可能性，",
            "advice": "您目前的高血压风险等级得分等于您最佳状态得分，表明您不存在导致高血压患病的可变危险因素，希望您继续保持。"
        }, {
            "diseaseName": "",
            "define": "",
            "risk": "",
            "ideal": "",
            "actual": "",
            "level": "",
            "advice": ""
        }, {
            "diseaseName": "",
            "define": "",
            "risk": "",
            "ideal": "",
            "actual": "",
            "level": "",
            "advice": ""
        }, {
            "diseaseName": "",
            "define": "",
            "risk": "",
            "ideal": "",
            "actual": "",
            "level": "",
            "advice": ""
        },
    ],
    "riskAdvice": [
        {
            "index": "1",
            "risk": "年龄",
            "result": "38.4",
            "ideal": "随着年龄增加风险升高",
            "advice": "---",
        }, {
            "index": "",
            "risk": "体重指数（BMI）",
            "result": "18",
            "ideal": "18.5-23.9",
            "advice": "继续保持",
        }
    ]
}*/
