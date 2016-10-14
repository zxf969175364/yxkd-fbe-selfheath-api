import fs from 'fs'
import base from './base'
export default function(){
    //服务层初始化
    G.dao = {};
    G.dao.base = base;
    G.dao.load = function(path){
        path = G.path.dao+'/'+path+'.js';
        if(fs.existsSync(path)){
            return require(path).default
        }
    }
}