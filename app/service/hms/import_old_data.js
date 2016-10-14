import qusDao from '../../dao/hms/basic/questionnaire'
import cardDao from '../../dao/hms/assess/card'
import importExcel from '../../service/hms/import_excel'
import QAnswerDao from '../../dao/hms/basic/result'
import Const from '../../utils/const/card_const'

export default {

    // 导出问卷excel
    downloadQusExcel: async function (query) {
        'use strict';

        let qusHead = {
            'questionnaireName': '问题卷名称',
            'sectionName': '维度名称',
            'questionsID': '问题ID',
            'questionSer': '题库中问题编号与问题ID效果一致',
            'questionName': '题干',
            'questionType': '题目类型',
            'index': '维度中第几个问题'
        };

        let qus = await qusDao.findOne(query);

        let qusData = [];

        let maxcolumn = 0;

        qus.section.forEach(sect => {

            sect.questions.forEach(quest => {

                let queObj = {};
                queObj.questionnaireName = qus.questionnaireName;
                queObj.sectionName = sect.sectionName;
                queObj.questionName = quest.questionName;
                switch (quest.questionType) {
                    case 'SINGLE_CHOICE':
                        queObj.questionType = '单选';
                        break;
                    case 'MULTI_CHOICE':
                        queObj.questionType = '多选';
                        break;
                    case 'BLANKS':
                        queObj.questionType = '天空';
                        break;
                    default:
                        break;
                }
                queObj.questionSer = quest.questionSer;
                queObj.index = quest.index;
                queObj.questionsID = quest.id;

                if (quest.options.length > maxcolumn) {
                    maxcolumn = quest.options.length;
                }

                quest.options.forEach(function (quop, index) {
                    queObj['zoption' + (index + 1)] = quop.optionTag + '.' + quop.optionName;
                });

                qusData.push(queObj);

            });

        });

        for (var i = 1; i <= maxcolumn; i++) {

            qusHead['zoption' + i] = '答案' + i;

        }

        let filename = Date.now() + '.xlsx';

        let data = {
            sheets: [{
                header: {},
                items: qusData,
                sheetName: 'sheet1',
            }],
            filepath: G.path.public + '/' + filename
        };

        data.sheets[0].header = qusHead;

        try {
            await importExcel.writeExcle(data);
            let result = {
                filepath: data.filepath,
                filename: filename,
                num: qusData.length
            };
            return result;

        } catch (error) {
            throw error;
        }

    },

    createResult: async function (data) {
        return QAnswerDao.create(data);
    },

    createCard: async function (card) {
        'use strict';
        let query = {};
        query.cardNumber = card.cardNumber;
        let result = await cardDao.findOne(query);
        if (!!result) {
            throw new Error(Const.ASSESSCARD.ASSESSCARD_IS_EXIST)
        } else {
            return cardDao.create(card);
        }
    }
};

