/**
 * Created by zjp on 16/7/29.
 */
import base from './base';
var captcha = require('ccap');

export default class extends base {

    async get(){

        var ccap = captcha({
            height: 60,
            width: 160,
            generate: function () {
                var str = "",
                    range = 4,
                    arr = ['0','1','2', '3', '4', '5', '6', '7', '8', '9'];
                for (var i = 0; i < range; i++) {
                    let pos = Math.round(Math.random() * (arr.length - 1));
                    str += arr[pos];
                }
                return str;
            }
        });

        var ary = ccap.get();
        this.req.session['captcha'] = ary[0];
        var buf = ary[1];
        this.res.writeHead(200,{'Content-Type': 'image/bmp'});
        this.res.end(buf);
        // this.json();
    }

}