#ECLNode version 1.0

+ dependency express babel waterline

安装依赖  `npm install`
运行程序  `node app.js`

就是这么简单 这么任性~！

1.程序代码风格：不加分号，[,{,\,+,- 这5个开头的除外，需要在前面加上分号；
;[1,2,3].forEach()、

#note
+ 需要安装babel6，通过babel转码运行
---开发 webstorm，添加file watcher babel转码
---上线 先编译npm run build，然后
+ 开发时候