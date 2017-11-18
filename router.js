const express = require('express');
const handler = require('./handler');
const router = express.Router();
//设置路由
router.get('/', handler.getIndex)
    .get('/index', handler.getIndex)
    .get('/add', handler.getAdd)
    .post('/add', handler.postAdd)
    .get('/edit', handler.getEdit)
    .post('/edit', handler.postEdit)
    .get("/del", handler.getDel)
    .get('/login', handler.getLogin)
    .post('/login', handler.postLogin);
module.exports = router;