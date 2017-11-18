const mongoose = require('mongoose');
//连接数据库
mongoose.connect('mongodb://localhost/itcast', { useMongoClient: true });
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
//定义约束
var schema = new Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    img: { type: String, required: true }
});
//根据约束创建对象模型
var hero = mongoose.model('heros', schema);
//暴露
module.exports = hero;