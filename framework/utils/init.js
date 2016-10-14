/**
 * Created by admin on 16/5/29.
 */
import debug from 'debug'
import path from 'path'

export default function(root, app_path, core_path){
    //工具初始化
    //debug.log = console.info.bind(console);

    global.T = {}
    //const _error = debug('app:error')
    //const _log = debug('app:log')
    const _debug = debug('app:debug')

    T.log = function(filename,args){
        "use strict";
        console.log(filename,args)
    }
    T.error = function(filename,args){
        "use strict";
        console.error(filename,args)
    }
    T.debug = function(filename,args){
        "use strict";
        if(G.debug){
            if(filename.indexOf('.js')>-1){
                let realfile = path.relative(root,filename)
                debug(realfile)(args)
            }else{
                _debug(filename,args)
            }
        }
    }
}