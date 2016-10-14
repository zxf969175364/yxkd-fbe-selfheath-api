import lodash from 'lodash'
import fs from 'fs'
import moment from 'moment'
moment.locale('zh-cn')

export default function (root, app_path, core_path) {
    global._ = lodash
    _.moment = moment
    app_path = app_path || root + '/app'
    core_path = core_path || root + '/framework'

    //全局方法初始化 可以直接用 T. 调用
    require(core_path + '/utils/init').default(root, app_path, core_path)
    //全局变量初始化
    require(core_path + '/config/init').default(root, app_path, core_path);
    //控制层类初始化
    require(core_path + '/controller/init').default()
    //服务层类初始化
    require(core_path + '/service/init').default()
    //数据访问层类初始化
    require(core_path + '/dao/init').default()
    //模型层初始化
    let db = function (cb) {
        cb()
    }
    if (G.db && G.db.connections && Object.keys(G.db.connections).length > 0) {
         db = require(core_path + '/model/init').default
    }
    //express 引入
    let app = require(core_path + '/core/express').default()
    //连接服务 socket io 等服务
    require(core_path + '/core/connect').default(app, db)
}