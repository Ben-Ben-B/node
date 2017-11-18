    //用来封装请求静态文件，并且响应回浏览器的步骤：
    //参数1：url：要得到的静态文件的名称
    var fs = require("fs");
    var template = require("art-template");
    //封装
    module.exports = function render(res) {
        res.render = function(url, obj, callback) {
            url = './views/' + url + '.html';
            fs.readFile(url, 'utf-8', (err1, data) => {
                if (err1) { return callback(err1) };
                var html = template.compile(data)(obj || {});
                callback(null, html)
            })
        }
    }