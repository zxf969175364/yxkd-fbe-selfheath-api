import base from './base'
import commonConst from '../../../utils/common'
import fs from 'fs'
import cardService from '../../../service/hms/assess/card'
import reportService from '../../../service/hms/report/report'

export default class extends base {

    //获取问卷答案(查询\列表\详情)
    async get() {

        let data = {};
        let map = this.req.query || {};
        let rs = commonConst.getAssessSuccess();
        let format = this.req.query.format;

        if (!map.cardId) {
            rs = commonConst.getAssessFail();
            rs.message = '测评卡ID不可为空';
            this.result(rs, format);
            return;
        }

        let card = await cardService.findOne({ id: map.cardId });

        if (!card) {
            rs = commonConst.getAssessFail();
            rs.message = '测评卡号无效';
            this.result(rs, format);
            return;
        }

        if (card.status != 'FINISHED') {
            rs = commonConst.getAssessFail();
            rs.message = '未完成答题';
            this.result(rs, format);
            return;
        }

        if (map.fileName) {

            let path = './app/public/pdf/' + map.cardId + '/' + map.fileName;

            try {

                let jpg = fs.readFileSync(path);
                this.resultJpg(jpg);

                return;

            } catch (error) {
                rs = commonConst.getAssessFail();
                rs.message = '没有这个文件';
                this.result(rs, format);
                return;
            }

        } else {

            let path = './app/public/pdf/' + map.cardId;

            let files = [];

            try {
                files = fs.readdirSync(path);
            } catch (error) {
                rs = commonConst.getAssessFail();
                rs.message = '请检测是否完成答题';
                this.result(rs, format);
                return;
            }

            let isFile = false;
            let reports = [];
            let address = '';

            if (!G.env.NODE_ENV || G.env.NODE_ENV.trim() === '' || G.env.NODE_ENV === 'development') {

                address = 'http://127.0.0.1:5000/api/AssessApi/reportImage?format=json&cardId=' + map.cardId + '&fileName=';

            } else if (G.env.NODE_ENV === 'test') {

                address = 'http://139.196.204.50:5000/api/AssessApi/reportImage?format=json&cardId=' + map.cardId + '&fileName=';

            }

            files.forEach(item => {
                if (item.split('.')[1] === 'jpg') {
                    isFile = true;
                    reports.push(address + item);
                }
            });

            if (!isFile) {
                rs = commonConst.getAssessFail();
                rs.message = '请检测是否完成答题';
                this.result(rs, format);
                return;
            }

            let report = await reportService.findOne({ cardId: map.cardId });

            rs.data.reportId = report.id;
            rs.data.cardId = map.cardId;
            rs.data.finishDate = _.moment(report.updatedAt).format('YYYY-MM-DD HH:mm:ss').toString();
            rs.data.reports = reports;

        }

        this.result(rs, format);
    }

}