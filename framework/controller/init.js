/**
 * Created by zj on 16/10/6.
 */
import fs from 'fs'
import base from './base'

export default function () {
    //控制层 功能类初始化
    G.controller = {}
    G.controller.base = base
    G.controller.http = require(G.path.core + '/controller/http').default
    G.controller.rest = require(G.path.core + '/controller/rest').default

    //跨控制层加载
    G.controller.load = function (path) {
        path = G.path.controller + '/' + path+'.js'
        if (fs.existsSync(path)) {
            return require(path).default
        }
    }
}