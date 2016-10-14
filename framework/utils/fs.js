import fs from 'fs';

const exists = filename => new Promise(resolve => {
    "use strict";
    fs.exists(filename, resolve);
});

const readFile = filename => new Promise((resolve, reject) => {
    "use strict";
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    });
});
const _work = (path,fileList) => {
    let dirList = fs.readdirSync(path);
    //深度优先
    /*
     dirList.forEach(function(item){
     if(fs.statSync(path + '/' + item).isDirectory()){
     walk(path + '/' + item);
     }else{
     fileList.push(path + '/' + item);
     }
     });*/
    //广度优先
    dirList.forEach(function(item){
        if(fs.statSync(path + '/' + item).isFile()){
            fileList.push(path + '/' + item);
        }
    });

    dirList.forEach(function(item){
        if(fs.statSync(path + '/' + item).isDirectory()){
            _work(path + '/' + item,fileList);
        }
    });
};
const walkDir = dirname =>  {
    "use strict";
    let fileList = [];
    _work(dirname,fileList);
    return fileList;
};

const getFileName = path => {
    "use strict";
     if(path && (path!=='/')){
         let sep =  path.split('/');
         let fileName = sep[sep.length -1];
         let sep1 = fileName.split('.');
         return sep1[0];
     }
};

export default { exists, readFile, walkDir ,getFileName};