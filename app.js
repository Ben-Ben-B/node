//开启服务器
const express = require('express')
const router = require('./router')
const app = express();
const session = require('express-session');
const cookie = require('cookie');

//配置使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use('/img', express.static('img'));
app.use('/node_modules', express.static('node_modules'));
//设置express的模板引擎
app.engine('html', require('express-art-template'))
    //中间件
app.use((req, res, next) => {
    if (!req.url.endsWith('/login') && !req.session.views) {
        if (!req.headers.cookie || !cookie.parse(req.headers.cookie).uName) {
            res.send(`<script>alert("您还没有登录，请登录");window.location='/login';</script>`)
        }
    } else {
        req.session.views = cookie.parse(req.headers.cookie).uName;
        next();
        // res.send(`<script>alert("欢迎回来");window.location='/';</script>`)
    }


})

//设置外置路由
app.use(router);
app.use(function(req, res) {
    res.send('404 您访问的页面不存在')
});

//监听端口
app.listen(3000, () => {
    console.log('running')
})