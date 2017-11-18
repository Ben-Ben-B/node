const fs = require("fs");
const path = require('path');
const urlM = require('url');
const formidable = require('formidable');
const heros = require("./modules.js");
const querystring = require('querystring');
const cookie = require("cookie");
const mongoose = require('mongoose');
module.exports.getIndex = function(req, res) {
    heros.find({}, (err, docs) => {
        if (err) {
            return res.send('404 not find')
        }
        res.render('index.html', { heros: docs })
    })
}
module.exports.getAdd = function(req, res) {
    res.render('add.html')
}
module.exports.postAdd = function(req, res) {
    var form = new formidable.IncomingForm();
    //由于formideble会自动将文件保存在一个临时目录下，所以我们需要将保存的路径进行修改：/img
    form.uploadDir = './img';
    //保留文件的扩展名
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        // console.log(fields);
        // console.log(files);
        var h = new heros();
        h.name = fields.name;
        h.gender = fields.gender;
        h.img = path.basename(files.img.path);
        h.save((err) => {
                if (err) {
                    return res.JSON({
                        status: 0,
                        msg: 'fail'
                    })
                }
                res.json({
                    status: 200,
                    msg: 'sucess'
                })
            })
            // mmodule.add(obj, (err) => {
            //     if (err) {
            //         return res.end(returnObj())
            //     }
            //     res.end(returnObj(200, 'success'))
            // })
    })
}
module.exports.getEdit = function(req, res) {
    var url = req.url;
    var id = urlM.parse(url, true).query.id;
    heros.findById(id, (err, docs) => {
            if (err) {
                return res.send(err.message);
            }
            res.render('edit.html', { obj: docs })
        })
        // mmodule.getDataById(id, (err, obj) => {
        //     if (err) { return res.end('404 not find') };
        //     res.render('edit.html', obj)
        // })

}
module.exports.postEdit = function(req, res) {
    var form = new formidable.IncomingForm();
    //由于formideble会自动将文件保存在一个临时目录下，所以我们需要将保存的路径进行修改：/img
    form.uploadDir = './img';
    //保留文件的扩展名
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) { return res.end('404 not find') };
        if (files.img) { fields.img = path.basename(files.img.path) };
        // console.log(files);
        heros.findById(fields.id, (err, docs) => {
                if (err) {
                    return res.send('404 not find')
                }
                if (fields.img == 'undefined') {
                    fields.img = docs.img;
                };
                var updateObj = {
                    name: fields.name,
                    img: fields.img,
                    gender: fields.gender
                };
                heros.findByIdAndUpdate(fields.id, { $set: updateObj }, (err1) => {
                    if (err1) {
                        return res.json({
                            status: 0,
                            msg: err1.message
                        })
                    } else {
                        res.json({
                            status: 200,
                            msg: 'success'
                        })
                    }
                })
            })
            // mmodule.edit(fields, (err1) => {
            //     if (err1) {
            //         return res.end(returnObj())
            //     }
            //     res.end(returnObj(200, 'success'))
            // })
    })
}
module.exports.getDel = function(req, res) {
    var url = req.url;
    var id = urlM.parse(url, true).query.id;
    heros.findByIdAndRemove(id, (err) => {
        if (err) {
            return res.json({
                status: 0,
                msg: err.message
            })
        } else {
            res.json({
                status: 200,
                msg: "success"
            })
        }
    })

}
module.exports.getLogin = function(req, res) {
    res.render('login.html');
}
module.exports.postLogin = function(req, res) {
    var str = "";
    req.on('data', (chunk) => {
        str += chunk;
    })
    req.on('end', () => {
        var query = querystring.parse(str);
        if (query.uName == 'admin' && query.pwd == '888') {
            req.session.views = query.uName;
            if (query.isRemember) {
                res.setHeader('Set-Cookie', cookie.serialize('uName', String(query.uName), {
                    maxAge: 60 * 60 * 24 * 7 // 1 week 
                }));
            }
            res.send(`<script>alert("登录成功");window.location="/"</script>`)
        } else {
            res.send(`<script>alert("登录失败");window.location="/login"</script>`)
        }

    })
}