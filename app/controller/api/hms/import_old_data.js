/**
 * Created by ZXF on 2016/8/12.
 */
import base from './base';
// let roleService = G.service.load('organization');
import testService from '../../../service/hms/import_old_data'
import commonConst from '../../../utils/common'
import extraTools from  '../../../utils/tools'
import importExcel from '../../../service/hms/import_excel'
import cardService from '../../../service/hms/assess/card'
import countentService from '../../../service/hms/rules/content_rule'
import userService from '../../../service/hms/organizations/user'
import customerService from '../../../service/hms/customer/customers'
import reportService from '../../../service/hms/report/report'
var fs = require('fs');

export default class extends base {
    //
    // /**
    //  * 获取所有测评数据日志
    //  */
    // async get() {
    //     let data = [];
    //     let rs = commonConst.result.SUCCESS;
    //     rs.data = commonConst.getResData();
    //     let map = this.req.query || {};
    //
    //     try {
    //
    //         map = extraTools.Query(map);
    //
    //         data = await testService.downloadQusExcel(map);
    //
    //     } catch (error) {
    //         rs = commonConst.result.FAIL;
    //         rs.error.message = error.message
    //     }
    //
    //     this.json(rs)
    // }

    /**
     *  调用旧库接口
     */
    async get() {
        let data = [];
        let rs = commonConst.result.SUCCESS;
        rs.data = commonConst.getResData();
        let map = this.req.query || {};

        apiClient.BaseService.post('account/login', {

            data: {
                LoginName: '18003admin',
                LoginPwd: '18003admin'
            }
        }).then((result) => {
            return apiClient.BaseService.post('Center/AssessData/Exportxls', {
                data: {
                    BeginDate: '2015-11-21',
                    EndDate: '2015-11-22'
                }
            });
        }).then(res => {
            console.log(res);
        })
    }

    /**
     * 添加测评数据日志
     */
    async post() {
        let data = this.req.body;
        let res = commonConst.result.SUCCESS;

        try {

            let path = 'D:\\data';

            let files = fs.readdirSync(path);

            var cardCount = await cardService.count({});

            for (let file of files) {

                let excelFilePtah = path + '\\' + file;

                let excelPaths = fs.readdirSync(excelFilePtah);

                for (let excelPath of excelPaths) {

                    let jsons = importExcel.sheetToJSON(excelFilePtah + '\\' + excelPath, '导出数据');

                    let qusMapping = {
                        // q2              0           健康史        1           多选
                        // ,quTitle:'很多慢性疾病具有家族遗传倾向，如高血压、糖尿病、恶性肿瘤等（即家族史）'}, q2              1
                        //      健康史 1-1         多选     ,quTitle:'请选择所患疾病的名称：（可多选）'}, q3
                        //   2 健康史        1-2         多选     ,quTitle:'请确定所患恶性肿瘤的名称：（可多选）'}, q2
                        //           3 健康史        1-3         单选     ,quTitle:'请选择患病年龄：'},
                        'q5': {
                            quSer: 4,
                            sectionName: '健康史',
                            index: '2',
                            options: '单选',
                            quTitle: '您目前是否有明确诊断的疾病或异常？'
                        },
                        'q6': {
                            quSer: 5,
                            sectionName: '健康史',
                            index: '2-1',
                            options: '多选',
                            quTitle: '请您确认您所患具体疾病或异常的名称：（可多选）'
                        },
                        'q7': {
                            quSer: 6,
                            sectionName: '健康史',
                            index: '2-2',
                            options: '多选',
                            quTitle: '请确认您所患恶性肿瘤的名称：（可多选）'
                        },
                        'q8': {
                            quSer: 7,
                            sectionName: '健康史',
                            index: '3',
                            options: '单选',
                            quTitle: '您身体是否出现过过敏？'
                        },
                        'q9': {
                            quSer: 8,
                            sectionName: '健康史',
                            index: '3-1',
                            options: '多选',
                            quTitle: '请选择过敏原？（可多选）'
                        },
                        'q10': {
                            quSer: 9,
                            sectionName: '健康史',
                            index: '4',
                            options: '单选',
                            quTitle: '您是否长期服用药物？'
                        },
                        'q11': {
                            quSer: 10,
                            sectionName: '健康史',
                            index: '4-1',
                            options: '多选',
                            quTitle: '您长期服用哪些药物？（可多选）'
                        },
                        'q23': {
                            quSer: 26,
                            sectionName: '健康史',
                            index: '5',
                            options: '单选',
                            quTitle: '最近3个月,您感觉身体总体健康状况如何?'
                        },
                        // 无               11          健康史        6
                        // 单选,quTitle:'最近一段时间，您感觉到情绪低落，闷闷不乐吗？'}, 无               12          健康史
                        //      7 单选,quTitle:'最近一段时间，您感觉对人对事缺乏热情或心力枯竭吗？'}, 无               13
                        //     健康史 8           单选,quTitle:'最近一段时间，您是否注意力集中有困难？'},
                        'q12': {
                            quSer: 14,
                            sectionName: '健康史',
                            index: '9',
                            options: '单选',
                            quTitle: '您是否动过手术？'
                        },
                        'q13': {
                            quSer: 15,
                            sectionName: '健康史',
                            index: '9-1',
                            options: '多选',
                            quTitle: '请您选择手术的部位？（可多选）'
                        },
                        'q14': {
                            quSer: 16,
                            sectionName: '健康史',
                            index: '10',
                            options: '单选',
                            quTitle: '您第一次来月经的年龄？'
                        },
                        'q15': {
                            quSer: 17,
                            sectionName: '健康史',
                            index: '11',
                            options: '单选',
                            quTitle: '您是否绝经？'
                        },
                        'q16': {
                            quSer: 18,
                            sectionName: '健康史',
                            index: '1-1',
                            options: '单选',
                            quTitle: '您的绝经年龄？'
                        },
                        'q17': {
                            quSer: 19,
                            sectionName: '健康史',
                            index: '12',
                            options: '单选',
                            quTitle: '您的结婚年龄？'
                        },
                        'q18': {
                            quSer: 20,
                            sectionName: '健康史',
                            index: '13',
                            options: '单选',
                            quTitle: '您是否生育过？'
                        },
                        'q19': {
                            quSer: 21,
                            sectionName: '健康史',
                            index: '13-1',
                            options: '单选',
                            quTitle: '初产年龄？'
                        },
                        'q20': {
                            quSer: 22,
                            sectionName: '健康史',
                            index: '13-2',
                            options: '单选',
                            quTitle: '您的孩子是母乳喂养吗？'
                        },
                        'q21': {
                            quSer: 23,
                            sectionName: '健康史',
                            index: '13-3',
                            options: '单选',
                            quTitle: '哺乳时间？'
                        },
                        'q22': {
                            quSer: 24,
                            sectionName: '健康史',
                            index: '13-4',
                            options: '单选',
                            quTitle: '您是否曾患有妊娠糖尿病？'
                        },
                        'q118': {
                            quSer: 25,
                            sectionName: '健康史',
                            index: '13-5',
                            options: '单选',
                            quTitle: '您是否曾患有妊娠高血压？'
                        },
                        'q24': {
                            quSer: 27,
                            sectionName: '躯体症状',
                            index: '1',
                            options: '单选',
                            quTitle: '最近3个月,您感到疲劳乏力或周身明显不适吗？'
                        },
                        'q25': {
                            quSer: 28,
                            sectionName: '躯体症状',
                            index: '2',
                            options: '单选',
                            quTitle: '最近3个月,您视力有下降吗？'
                        },
                        'q26': {
                            quSer: 29,
                            sectionName: '躯体症状',
                            index: '3',
                            options: '单选',
                            quTitle: '最近3个月,您听力有下降吗？'
                        },
                        'q27': {
                            quSer: 30,
                            sectionName: '躯体症状',
                            index: '4',
                            options: '单选',
                            quTitle: '最近3个月,您有鼻出血或浓血鼻涕吗？'
                        },
                        'q28': {
                            quSer: 31,
                            sectionName: '躯体症状',
                            index: '5',
                            options: '单选',
                            quTitle: '最近3个月,您出现过吞咽不适、哽噎感吗？'
                        },
                        'q29': {
                            quSer: 32,
                            sectionName: '躯体症状',
                            index: '6',
                            options: '单选',
                            quTitle: '最近3个月,您有明显的咳嗽、咳痰吗？'
                        },
                        'q30': {
                            quSer: 33,
                            sectionName: '躯体症状',
                            index: '7',
                            options: '单选',
                            quTitle: '最近3个月,您有过咳痰带血或咯血吗？'
                        },
                        'q31': {
                            quSer: 34,
                            sectionName: '躯体症状',
                            index: '8',
                            options: '单选',
                            quTitle: '最近3个月,您感到胸痛或心前区憋闷不适吗？'
                        },
                        'q32': {
                            quSer: 35,
                            sectionName: '躯体症状',
                            index: '9',
                            options: '单选',
                            quTitle: '最近3个月,您感到有胸闷气喘或呼吸困难吗？'
                        },
                        'q33': {
                            quSer: 36,
                            sectionName: '躯体症状',
                            index: '10',
                            options: '单选',
                            quTitle: '最近3个月,您感到低热（体温偏高）吗？'
                        },
                        'q34': {
                            quSer: 37,
                            sectionName: '躯体症状',
                            index: '11',
                            options: '单选',
                            quTitle: '最近3个月,您感到头晕或头昏吗？'
                        },
                        'q35': {
                            quSer: 38,
                            sectionName: '躯体症状',
                            index: '12',
                            options: '单选',
                            quTitle: '最近3个月,您感到恶心、反酸或上腹部不适吗？'
                        },
                        'q36': {
                            quSer: 39,
                            sectionName: '躯体症状',
                            index: '13',
                            options: '单选',
                            quTitle: '最近3个月,您有过食欲不振、消化不良或腹胀吗？'
                        },
                        'q37': {
                            quSer: 40,
                            sectionName: '躯体症状',
                            index: '14',
                            options: '单选',
                            quTitle: '最近3个月,您有过不明原因跌倒或晕倒吗？'
                        },
                        'q38': {
                            quSer: 41,
                            sectionName: '躯体症状',
                            index: '15',
                            options: '单选',
                            quTitle: '最近3个月,您感到明显的手足发麻或刺痛吗？'
                        },
                        'q39': {
                            quSer: 42,
                            sectionName: '躯体症状',
                            index: '16',
                            options: '单选',
                            quTitle: '最近3个月,您双下肢水肿吗？'
                        },
                        'q40': {
                            quSer: 43,
                            sectionName: '躯体症状',
                            index: '17',
                            options: '单选',
                            quTitle: '最近3个月,您排尿困难吗？'
                        },
                        'q41': {
                            quSer: 44,
                            sectionName: '躯体症状',
                            index: '18',
                            options: '单选',
                            quTitle: '最近3个月,您有尿频、尿急、尿痛及尿血吗？'
                        },
                        'q42': {
                            quSer: 45,
                            sectionName: '躯体症状',
                            index: '19',
                            options: '单选',
                            quTitle: '最近3个月,您有腹泻、腹痛或大便习惯改变（入厕时间、次数、形状等）吗？'
                        },
                        'q43': {
                            quSer: 46,
                            sectionName: '躯体症状',
                            index: '20',
                            options: '单选',
                            quTitle: '最近3个月,您出现过柏油样便或便中带血吗？'
                        },
                        'q44': {
                            quSer: 47,
                            sectionName: '躯体症状',
                            index: '21',
                            options: '单选',
                            quTitle: '最近3个月,您出现过不明原因的身体消瘦或体重减轻吗？（体重减轻超过原来体重的10%）'
                        },
                        'q47': {
                            quSer: 50,
                            sectionName: '躯体症状',
                            index: '22',
                            options: '单选',
                            quTitle: '最近3个月,您身体有过明显的疼痛吗？（伤害除外）'
                        },
                        'q48': {
                            quSer: 51,
                            sectionName: '躯体症状',
                            index: '22-1',
                            options: '多选',
                            quTitle: '疼痛的部位？（可多选）'
                        },
                        'q45': {
                            quSer: 48,
                            sectionName: '躯体症状',
                            index: '23',
                            options: '单选',
                            quTitle: '最近3个月,您是否发现乳房有包块，并伴有胀痛吗（与月经周期无关）？'
                        },
                        'q46': {
                            quSer: 49,
                            sectionName: '躯体症状',
                            index: '24',
                            options: '单选',
                            quTitle: '最近3个月,您有不明原因的阴道出血、白带异常吗？'
                        },
                        'q49': {
                            quSer: 52,
                            sectionName: '生活习惯',
                            index: '1',
                            options: '单选',
                            quTitle: '您通常能够按时吃三餐吗？'
                        },
                        'q50': {
                            quSer: 53,
                            sectionName: '生活习惯',
                            index: '2',
                            options: '单选',
                            quTitle: '您是否经常吃夜宵吗？'
                        },
                        'q51': {
                            quSer: 54,
                            sectionName: '生活习惯',
                            index: '3',
                            options: '单选',
                            quTitle: '您常暴饮暴食吗？（每周2次以上）'
                        },
                        'q52': {
                            quSer: 55,
                            sectionName: '生活习惯',
                            index: '4',
                            options: '单选',
                            quTitle: '您平均每月参加请客吃饭（应酬）情况？'
                        },
                        'q53': {
                            quSer: 56,
                            sectionName: '生活习惯',
                            index: '5',
                            options: '单选',
                            quTitle: '您的饮食口味？'
                        },
                        'q54': {
                            quSer: 57,
                            sectionName: '生活习惯',
                            index: '6',
                            options: '多选',
                            quTitle: '您的饮食嗜好？（可多选）'
                        },
                        'q55': {
                            quSer: 58,
                            sectionName: '生活习惯',
                            index: '7',
                            options: '单选',
                            quTitle: '您的主食结构如何？'
                        },
                        'q56': {
                            quSer: 59,
                            sectionName: '生活习惯',
                            index: '8',
                            options: '单选',
                            quTitle: '您喝牛奶吗？'
                        },
                        'q57': {
                            quSer: 60,
                            sectionName: '生活习惯',
                            index: '9',
                            options: '单选',
                            quTitle: '您吃鸡蛋吗？'
                        },
                        'q58': {
                            quSer: 61,
                            sectionName: '生活习惯',
                            index: '10',
                            options: '单选',
                            quTitle: '您吃豆类及豆制品吗？'
                        },
                        'q59': {
                            quSer: 62,
                            sectionName: '生活习惯',
                            index: '11',
                            options: '单选',
                            quTitle: '您吃水果吗？'
                        },
                        'q60': {
                            quSer: 63,
                            sectionName: '生活习惯',
                            index: '12',
                            options: '单选',
                            quTitle: '您平均每天吃多少蔬菜？'
                        },
                        'q61': {
                            quSer: 64,
                            sectionName: '生活习惯',
                            index: '13',
                            options: '单选',
                            quTitle: '您平均每天吃多少肉（猪、牛、羊、禽）？'
                        },
                        'q62': {
                            quSer: 65,
                            sectionName: '生活习惯',
                            index: '14',
                            options: '单选',
                            quTitle: '您吃肥肉吗？'
                        },
                        'q63': {
                            quSer: 66,
                            sectionName: '生活习惯',
                            index: '15',
                            options: '单选',
                            quTitle: '您吃动物内脏吗？'
                        },
                        'q64': {
                            quSer: 67,
                            sectionName: '生活习惯',
                            index: '16',
                            options: '单选',
                            quTitle: '您吃鱼肉或海鲜吗？'
                        },
                        'q65': {
                            quSer: 68,
                            sectionName: '生活习惯',
                            index: '17',
                            options: '单选',
                            quTitle: '您喝咖啡吗？'
                        },
                        'q66': {
                            quSer: 69,
                            sectionName: '生活习惯',
                            index: '18',
                            options: '单选',
                            quTitle: '您喝含糖饮料（果汁、可乐等）吗？'
                        },
                        'q67': {
                            quSer: 70,
                            sectionName: '生活习惯',
                            index: '19',
                            options: '单选',
                            quTitle: '您吸烟吗？'
                        },
                        'q70': {
                            quSer: 73,
                            sectionName: '生活习惯',
                            index: '19-1',
                            options: '单选',
                            quTitle: '您戒烟多长时间了？'
                        },
                        'q68': {
                            quSer: 71,
                            sectionName: '生活习惯',
                            index: '19-2',
                            options: '单选',
                            quTitle: '您通常每天吸多少支烟？（含戒烟前）'
                        },
                        'q69': {
                            quSer: 72,
                            sectionName: '生活习惯',
                            index: '19-3',
                            options: '单选',
                            quTitle: '您持续吸烟的年限？（含戒烟前）'
                        },
                        'q71': {
                            quSer: 74,
                            sectionName: '生活习惯',
                            index: '20',
                            options: '单选',
                            quTitle: '您喝酒吗？（平均每周饮酒1次以上）'
                        },
                        'q76': {
                            quSer: 79,
                            sectionName: '生活习惯',
                            index: '20-1',
                            options: '单选',
                            quTitle: '您戒酒多长时间了？'
                        },
                        'q72': {
                            quSer: 75,
                            sectionName: '生活习惯',
                            index: '20-2',
                            options: '多选',
                            quTitle: '您一般喝什么酒?（可多选）'
                        },
                        'q73': {
                            quSer: 76,
                            sectionName: '生活习惯',
                            index: '20-3',
                            options: '单选',
                            quTitle: '您每周喝几次酒？（含戒酒前）'
                        },
                        'q74': {
                            quSer: 77,
                            sectionName: '生活习惯',
                            index: '20-4',
                            options: '单选',
                            quTitle: '您每次喝几两？（1两相当于50ml白酒，100ml红酒，300ml啤酒）'
                        },
                        'q75': {
                            quSer: 78,
                            sectionName: '生活习惯',
                            index: '20-5',
                            options: '单选',
                            quTitle: '您持续喝酒的年限？（含戒酒前）'
                        },
                        'q77': {
                            quSer: 80,
                            sectionName: '生活习惯',
                            index: '21',
                            options: '单选',
                            quTitle: '您参加运动锻炼吗？ （平均每周锻炼1次以上）'
                        },
                        'q78': {
                            quSer: 81,
                            sectionName: '生活习惯',
                            index: '21-1',
                            options: '多选',
                            quTitle: '您常采用的锻炼方式：（可多选）'
                        },
                        'q79': {
                            quSer: 82,
                            sectionName: '生活习惯',
                            index: '21-2',
                            options: '单选',
                            quTitle: '您每周锻炼几次？'
                        },
                        'q80': {
                            quSer: 83,
                            sectionName: '生活习惯',
                            index: '21-3',
                            options: '单选',
                            quTitle: '您每次锻炼多次时间？'
                        },
                        'q81': {
                            quSer: 84,
                            sectionName: '生活习惯',
                            index: '21-4',
                            options: '单选',
                            quTitle: '您坚持锻炼多少年了？'
                        },
                        'q82': {
                            quSer: 85,
                            sectionName: '生活习惯',
                            index: '22',
                            options: '单选',
                            quTitle: '您工作中的体力强度？'
                        },
                        'q83': {
                            quSer: 86,
                            sectionName: '生活习惯',
                            index: '22-1',
                            options: '单选',
                            quTitle: '您每周工作几天？ '
                        },
                        'q84': {
                            quSer: 87,
                            sectionName: '生活习惯',
                            index: '22-2',
                            options: '单选',
                            quTitle: '您每天工作多长时间？'
                        },
                        'q85': {
                            quSer: 88,
                            sectionName: '生活习惯',
                            index: '23',
                            options: '单选',
                            quTitle: '除工作、学习时间外，您每天坐着（如看电视、上网、打麻将、打牌等）的时间是？'
                        },
                        'q86': {
                            quSer: 89,
                            sectionName: '生活习惯',
                            index: '24',
                            options: '多选',
                            quTitle: '您的工作/生活场所经常会接触到哪些有害物质？（可多选）'
                        },
                        'q87': {
                            quSer: 90,
                            sectionName: '心理健康',
                            index: '1',
                            options: '单选',
                            quTitle: '最近两周,您感到闷闷不乐，情绪低落吗？'
                        },
                        'q88': {
                            quSer: 91,
                            sectionName: '心理健康',
                            index: '2',
                            options: '单选',
                            quTitle: '最近两周,您容易情绪激动或生气吗？'
                        },
                        'q89': {
                            quSer: 92,
                            sectionName: '心理健康',
                            index: '3',
                            options: '单选',
                            quTitle: '最近两周,您感到精神紧张，很难放松吗？'
                        },
                        'q90': {
                            quSer: 93,
                            sectionName: '心理健康',
                            index: '4',
                            options: '单选',
                            quTitle: '最近两周,您比平常容易紧张和着急吗？'
                        },
                        'q91': {
                            quSer: 94,
                            sectionName: '心理健康',
                            index: '5',
                            options: '单选',
                            quTitle: '最近两周,您容易发脾气，没有耐性吗？'
                        },
                        'q92': {
                            quSer: 95,
                            sectionName: '心理健康',
                            index: '6',
                            options: '单选',
                            quTitle: '最近两周,您感到心力枯竭，对人对事缺乏热情吗？'
                        },
                        'q93': {
                            quSer: 96,
                            sectionName: '心理健康',
                            index: '7',
                            options: '单选',
                            quTitle: '最近两周,您容易焦虑不安、心烦意乱吗？'
                        },
                        'q94': {
                            quSer: 97,
                            sectionName: '心理健康',
                            index: '8',
                            options: '单选',
                            quTitle: '最近两周,您感觉压抑或沮丧吗？'
                        },
                        'q95': {
                            quSer: 98,
                            sectionName: '心理健康',
                            index: '9',
                            options: '单选',
                            quTitle: '最近两周,您注意力集中有困难吗？'
                        },
                        'q96': {
                            quSer: 99,
                            sectionName: '心理健康',
                            index: '10',
                            options: '单选',
                            quTitle: '最近1个月，您的睡眠如何？'
                        },
                        'q97': {
                            quSer: 100,
                            sectionName: '心理健康',
                            index: '10-1',
                            options: '多选',
                            quTitle: '睡眠不好的主要表现？'
                        },
                        'q98': {
                            quSer: 101,
                            sectionName: '心理健康',
                            index: '10-2',
                            options: '多选',
                            quTitle: '影响您睡眠的原因？'
                        },
                        'q99': {
                            quSer: 102,
                            sectionName: '心理健康',
                            index: '11',
                            options: '单选',
                            quTitle: '您每晚的睡眠时间？（不等于卧床时间）'
                        },
                        'q100': {
                            quSer: 103,
                            sectionName: '健康素养',
                            index: '1',
                            options: '单选',
                            quTitle: '您多长时间做一次体检？'
                        },
                        'q101': {
                            quSer: 104,
                            sectionName: '健康素养',
                            index: '2',
                            options: '单选',
                            quTitle: '您是否主动获取医疗保健知识？'
                        },
                        'q102': {
                            quSer: 105,
                            sectionName: '健康素养',
                            index: '2-1',
                            options: '多选',
                            quTitle: '您获取医疗保健知识的途径？（可多选）'
                        },
                        'q103': {
                            quSer: 106,
                            sectionName: '健康素养',
                            index: '3',
                            options: '单选',
                            quTitle: '您乘坐私家车或出租车时系安全带吗？'
                        },
                        'q104': {
                            quSer: 107,
                            sectionName: '健康素养',
                            index: '4',
                            options: '单选',
                            quTitle: '您入厕观察二便（大小便）吗？'
                        },
                        'q105': {
                            quSer: 108,
                            sectionName: '健康素养',
                            index: '5',
                            options: '单选',
                            quTitle: '您自测血压、心率吗？'
                        },
                        'q106': {
                            quSer: 109,
                            sectionName: '健康素养',
                            index: '6',
                            options: '单选',
                            quTitle: '您出差或旅游带常用或急救药品吗？'
                        },
                        'q107': {
                            quSer: 110,
                            sectionName: '健康素养',
                            index: '7',
                            options: '单选',
                            quTitle: '您经常晒太阳吗？'
                        },
                        'q108': {
                            quSer: 111,
                            sectionName: '健康素养',
                            index: '8',
                            options: '单选',
                            quTitle: '以下血压检查结果，您认为最好的是哪一个？'
                        },
                        'q109': {
                            quSer: 112,
                            sectionName: '健康素养',
                            index: '9',
                            options: '单选',
                            quTitle: '您认为成年人腋下体温最理想的范围是？'
                        },
                        'q110': {
                            quSer: 113,
                            sectionName: '健康素养',
                            index: '10',
                            options: '单选',
                            quTitle: '您认为安静状态下成年人最理想的脉搏次数是？'
                        },
                        'q111': {
                            quSer: 114,
                            sectionName: '健康素养',
                            index: '11',
                            options: '单选',
                            quTitle: '您认为成年人每天最佳食盐量不能超过多少克？'
                        },
                        'q112': {
                            quSer: 115,
                            sectionName: '健康素养',
                            index: '12',
                            options: '单选',
                            quTitle: '您认为成年人正常体重指数是（体重指数=体重kg/身高m2）？'
                        },
                        'q113': {
                            quSer: 116,
                            sectionName: '健康素养',
                            index: '13',
                            options: '单选',
                            quTitle: '您认为成年人正常腰围是？'
                        },
                        'q114': {
                            quSer: 116,
                            sectionName: '健康素养',
                            index: '13',
                            options: '单选',
                            quTitle: '您认为成年人正常腰围是？'
                        },
                        'q115': {
                            quSer: 117,
                            sectionName: '健康素养',
                            index: '14',
                            options: '单选',
                            quTitle: '您认为成人空腹血糖正常值是？'
                        },
                        'q116': {
                            quSer: 118,
                            sectionName: '健康素养',
                            index: '15',
                            options: '单选',
                            quTitle: '您认为成人甘油三脂正常值是？'
                        },
                        'q119': {
                            quSer: 119,
                            sectionName: '健康素养',
                            index: '16',
                            options: '单选',
                            quTitle: '您认为成人总胆固醇理想值是？'
                        },
                        'q120': {
                            quSer: 120,
                            sectionName: '健康素养',
                            index: '17',
                            options: '单选',
                            quTitle: '答完该问卷，您感觉自己最近身体总体健康状况如何?'
                        },
                        'q121': {
                            quSer: 121,
                            sectionName: '健康素养',
                            index: '18',
                            options: '单选',
                            quTitle: '您对该问卷的总体印象如何？'
                        },
                    };

                    let contents = await countentService.find({ isDelete: false });
                    let contentData = {};

                    contents.forEach(item => {

                        contentData[item.section] = item;

                        item.levels.forEach(function (level, index) {
                            contentData[item.section]['level_' + (index + 1)] = level;
                        });

                    });

                    let user = await userService.findByName(file);

                    if (!user) {
                        res = commonConst.result.FAIL;
                        res.error.message = '没有这个账户';
                        this.json(res);
                    }
                    let hospitalId = user.hospitalId;
                    let agencyId = user.agencyId;
                    let centerId = user.centerId;

                    for (let excel of jsons) {

                        var excelData = excel;

                        var csutomer = {};

                        if (excel['身份证号']) {
                            csutomer = await customerService.findOne({ IDNumber: excel['身份证号'] });

                            if (!csutomer) {
                                let csut = {
                                    height: excel['身高'],
                                    weight: excel['体重'],
                                    gender: excel['性别'],
                                    IDNumber: excel['身份证号'],
                                    realName: excel['姓名'],
                                    mobile: excel['手机'],
                                    nationality: excel['民族'],
                                    company: excel['工作单位'],
                                    education: excel['教育程度'],
                                    maritalStatus: excel['婚姻状况'],
                                    occupation: excel['职业'],
                                    medicare: excel['医保类型'],
                                    followUpType: excel['随访方式'],
                                    age: excel['年龄'],
                                    isDelete: false,
                                    isOld: true,

                                };

                                csutomer = await customerService.create(csut);
                            }
                        }

                        let card = {};
                        cardCount += 1;
                        card.cardNumber = extraTools.createOldCardNumber(12, cardCount);
                        console.error('总数:' + cardCount);
                        console.error('卡号:' + card.cardNumber);
                        console.log();
                        card.password = extraTools.createPassword(12);
                        card.hospitalId = hospitalId;
                        card.agencyId = agencyId;
                        card.centerId = centerId;
                        card.questionnaireId = '57b45b2f8a5628df0aa90246';
                        card.questionnaireName = '健康体检自测问卷';
                        card.status = 'FINISHED';
                        card.finishSection = '健康素养';
                        card.nextSection = '没有了';
                        card.nextNumber = '5';

                        if (csutomer.id) {
                            card.customerId = csutomer.id;
                        }
                        if (excel['体检日期']) {
                            card.isChecked = true;
                        }

                        card.IDNumber = excel['身份证号'];
                        card.mobile = excel['手机'];
                        card.Tel = excel['座机'];
                        card.realName = excel['姓名'];
                        card.gender = excel['性别'];
                        card.age = excel['年龄'];
                        card.height = excel['身高'];
                        card.weight = excel['体重'];
                        card.education = excel['教育程度'];
                        card.maritalStatus = excel['婚姻状况'];
                        card.nationality = excel['民族'];
                        card.medicare = excel['医保类型'];
                        card.company = excel['工作单位'];
                        card.occupation = excel['职业'];
                        card.followUpType = excel['随访方式'];
                        card.province = excel['省'];
                        card.city = excel['市'];
                        card.followUpType = excel['随访方式'];
                        card.isOld = true;
                        card.createdAt = new Date(excel['完成日期']);
                        card.updatedAt = new Date(excel['完成日期']);

                        let resultData = await cardService.addCard(card);
                        resultData.questionnaireName = '健康体检自测问卷';
                        resultData.cardId = resultData.id;

                        let result = {};
                        result.cardNumber = resultData.cardNumber;
                        result.questionnaireId = resultData.questionnaireId;
                        result.questionnaireName = resultData.questionnaireName;
                        result.finishSection = resultData.finishSection;
                        result.nextSection = resultData.nextSection;
                        result.nextNumber = resultData.nextNumber;
                        result.agencyId = resultData.agencyId;
                        result.hospitalId = resultData.hospitalId;
                        result.centerId = resultData.centerId;
                        result.cardId = resultData.id;
                        result.centerId = resultData.centerId;
                        result.isOld = true;
                        result.section = [
                            {
                                questions: [],
                                sectionName: '健康史',
                                result: {
                                    minScore: contentData['健康史']['level_' +
                                    excelData['健康史等级']].minScore,
                                    maxScore: contentData['健康史']['level_' +
                                    excelData['健康史等级']].maxScore,
                                    level: excelData['健康史等级'],
                                    levelName: contentData['健康史']['level_' + excelData['健康史等级']].levelName,
                                    desc: contentData['健康史']['level_' + excelData['健康史等级']].desc,
                                    score: excelData['健康史'],
                                }
                            },
                            {
                                questions: [], sectionName: '躯体症状', result: {
                                minScore: contentData['躯体症状']['level_' + excelData['躯体症状等级']].minScore,
                                maxScore: contentData['躯体症状']['level_' + excelData['躯体症状等级']].maxScore,
                                level: excelData['躯体症状等级'],
                                levelName: contentData['躯体症状']['level_' +
                                excelData['躯体症状等级']].levelName,
                                desc: contentData['躯体症状']['level_' +
                                excelData['躯体症状等级']].desc,
                                score: excelData['躯体症状'],
                            }
                            },
                            {
                                questions: [],
                                sectionName: '生活习惯',
                                result: {
                                    minScore: contentData['生活习惯']['level_' + excelData['生活习惯等级']].minScore,
                                    maxScore: contentData['生活习惯']['level_' + excelData['生活习惯等级']].maxScore,
                                    level: excelData['生活习惯等级'],
                                    levelName: contentData['生活习惯']['level_' + excelData['生活习惯等级']].levelName,
                                    desc: contentData['生活习惯']['level_' + excelData['生活习惯等级']].desc,
                                    score: excelData['生活习惯'],
                                }
                            },
                            {
                                questions: [],
                                sectionName: '心理健康',
                                result: {
                                    minScore: contentData['心理健康']['level_' + excelData['精神压力等级']].minScore,
                                    maxScore: contentData['心理健康']['level_' + excelData['精神压力等级']].maxScore,
                                    level: excelData['精神压力等级'],
                                    levelName: contentData['心理健康']['level_' + excelData['精神压力等级']].levelName,
                                    desc: contentData['心理健康']['level_' + excelData['精神压力等级']].desc,
                                    score: excelData['精神压力'],
                                }
                            },
                            {
                                questions: [],
                                sectionName: '健康素养',
                                result: {
                                    minScore: contentData['健康素养']['level_' + excelData['健康素养等级']].minScore,
                                    maxScore: contentData['健康素养']['level_' + excelData['健康素养等级']].maxScore,
                                    level: excelData['健康素养等级'],
                                    levelName: contentData['健康素养']['level_' + excelData['健康素养等级']].levelName,
                                    desc: contentData['健康素养']['level_' + excelData['健康素养等级']].desc,
                                    score: excelData['健康素养'],
                                }
                            }
                        ];

                        if (excelData['q1'] === '是') {

                            var q2q3 = {};
                            let q2Str = excelData['q2'].trim();
                            let q3Str = excelData['q3'].trim();

                            let relativeName = '';

                            if (q2Str) {
                                let q2List = q2Str.split('；'); // ["母亲：C.冠心病|65岁之后患病", "E.糖尿病",
                                                               // "父亲：A.高血压|55岁之后患病",
                                                               // "C.冠心病|55岁之后患病", ""]

                                q2List.forEach(item => {

                                    if (!item) return;

                                    let itemList = item.split('：');   // ["母亲", "C.冠心病|65岁之后患病"]
                                                                      // ["E.糖尿病"]

                                    if (itemList.length > 1) {

                                        relativeName = itemList[0];     // 母亲

                                        q2q3[relativeName] = {           // q2q3{  母亲:{ disease:[] }   }
                                            disease: []
                                        };

                                        let an = itemList[1].split('|');   // ["C.冠心病", "65岁之后患病"]

                                        let disea = {};

                                        let quSer = '1';

                                        if (an[0]) {
                                            disea.option = an[0];
                                        }

                                        if (an[0].indexOf('其他') >= 0) {
                                            disea.age = '其他';
                                        }

                                        if (an[1]) {
                                            disea.age = an[1];
                                            quSer = '2';
                                        }

                                        disea.questionSer = quSer;
                                        disea.tag = disea.option.split('.')[0];
                                        q2q3[relativeName].disease.push(disea);

                                    } else {
                                        if (itemList[0]) {

                                            let an = itemList[0].split('|');   // ["E.糖尿病"]

                                            let disea = {};

                                            let quSer = '1';

                                            if (an[0]) {
                                                disea.option = an[0];
                                            }

                                            if (an[0].indexOf('其他') >= 0) {
                                                disea.age = '其他';
                                            }

                                            if (an[1]) {
                                                disea.age = an[1];
                                                quSer = '2';
                                            }
                                            disea.questionSer = quSer;
                                            disea.tag = disea.option.split('.')[0];
                                            q2q3[relativeName].disease.push(disea);

                                        }

                                    }

                                });
                            }

                            if (q3Str) {
                                let q3List = q3Str.split('；'); // ["祖父：B.肝癌", "B.肝癌", "父亲：B.肝癌"]

                                q3List.forEach(item => {

                                    if (!item) return;

                                    let itemList = item.split('：');   // ["祖父","B.肝癌"]

                                    if (itemList.length > 1) {

                                        relativeName = itemList[0];     // 祖父

                                        var re = {
                                            option: itemList[1],
                                            questionSer: '2'
                                        };

                                        if (itemList[1].indexOf('其他') >= 0) {
                                            re.age = '其他';
                                        }
                                        re.tag = re.option.split('.')[0];
                                        q2q3[relativeName].disease.push(re);

                                    } else {

                                        var re = {
                                            option: itemList[1],
                                            questionSer: '2'
                                        };

                                        if (itemList[1].indexOf('其他') >= 0) {
                                            re.age = '其他';
                                        }
                                        re.tag = re.option.split('.')[0];
                                        q2q3[relativeName].disease.push(re);

                                    }

                                });
                            }

                            var resuQus = {
                                'index': 1,
                                'answer': [],
                                'title': '很多慢性疾病具有家族遗传倾向，如高血压、糖尿病、恶性肿瘤等（即家族史）。因此您袓父母、父母及兄弟姐妹所患疾病可能也会是您的易患疾病，请您认真回想并填写以下亲属所患疾病，如果没有，请点击继续。',
                                'questionSer': '0'
                            };

                            for (var key in q2q3) {
                                q2q3[key].relation = key;
                                resuQus.answer.push(q2q3[key]);
                            }

                            result.section[0].questions.push(resuQus);

                        }

                        for (var i = 5; i <= 121; i++) {

                            if (i === 117) {
                                continue;
                            }

                            let qus = qusMapping['q' + i];
                            let answers = excelData['q' + i];

                            let ruData = {};

                            if (i === 58 || i === 62 || i === 63 || i === 64) {

                                let ans = answers.trim().split('.')[0];
                                let answ = '';
                                switch (ans) {
                                    case 'A':
                                        answ = 'A.不吃（几乎从来不吃）';
                                        break;
                                    case 'B':
                                        answ = 'B.偶尔吃（每周1～2次）';
                                        break;
                                    case 'C':
                                        answ = 'C.经常吃（每周3～5次）';
                                        break;
                                    case 'D':
                                        answ = 'D.每天都吃（每周6次以上）';
                                        break;
                                }

                                ruData = {
                                    title: qus.quTitle,
                                    index: qus.index,
                                    answer: [{ option: answ, tag: ans }],
                                    questionSer: qus.quSer
                                };
                            }

                            else if (i === 120) {

                                let ans = answers.trim().split('.')[0];
                                let answ = '';
                                switch (ans) {
                                    case 'A':
                                        answ = 'B.好';
                                        break;
                                    case 'B':
                                        answ = 'B.好';
                                        break;
                                    case 'C':
                                        answ = 'C.一般';
                                        break;
                                    case 'D':
                                        answ = 'A.差';
                                        break;
                                    default:
                                        answ = 'C.一般';
                                        break;
                                }

                                ruData = {
                                    title: qus.quTitle,
                                    index: qus.index,
                                    answer: [{ option: answ, tag: ans }],
                                    questionSer: qus.quSer
                                };
                                continue;
                            }

                            else if (i === 121) {

                                let ans = answers.trim().split('.')[0];
                                let answ = '';
                                switch (ans) {
                                    case 'A':
                                        answ = 'A.很好';
                                        break;
                                    case 'B':
                                        answ = 'B.比较好';
                                        break;
                                    case 'C':
                                        answ = 'C.一般（还可以）';
                                        break;
                                    case 'D':
                                        answ = 'D.不好';
                                        break;
                                    case 'E':
                                        answ = 'E.不好说';
                                        break;
                                }

                                ruData = {
                                    title: qus.quTitle,
                                    index: qus.index,
                                    answer: [{ option: answ, tag: ans }],
                                    questionSer: qus.quSer
                                };
                                continue;
                            }

                            else if (qus.options === '单选') {
                                let ans = answers.trim().split('.')[0];
                                ruData = {
                                    title: qus.quTitle,
                                    index: qus.index,
                                    answer: [{ option: answers, tag: ans }],
                                    questionSer: qus.quSer
                                };
                            }

                            else if (qus.options === '多选') {
                                let question = {
                                    title: qus.quTitle,
                                    index: qus.index,
                                    answer: [],
                                    questionSer: qus.quSer
                                };

                                let answerList = answers.trim().split('；');
                                answerList.forEach(item => {
                                    question.answer.push({
                                        option: item,
                                        tag: item.trim().split('.')[0]
                                    });
                                });

                                ruData = question;
                            }

                            switch (qus.sectionName) {
                                case '健康史':
                                    result.section[0].questions.push(ruData);
                                    break;
                                case '躯体症状':
                                    result.section[1].questions.push(ruData);
                                    break;
                                case '生活习惯':
                                    result.section[2].questions.push(ruData);
                                    break;
                                case '心理健康':
                                    result.section[3].questions.push(ruData);
                                    break;
                                case '健康素养':
                                    result.section[4].questions.push(ruData);
                                    break;

                            }
                        }

                        let ruResult = await testService.createResult(result);
                        reportService.getReport(resultData);
                    }

                }

            }

            this.json(res);

        } catch (err) {
            res = commonConst.result.FAIL;
            res.error.message = err.message;
            this.json(res);
        }
    }

}