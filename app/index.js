const Koa = require('koa');
const koaBody = require('koa-body'); // 支持文件上传
const koaStatic = require('koa-static'); // 支持访问静态文件目录
const parameter = require('koa-parameter');
const mongoose = require('mongoose');
const error = require('koa-json-error');
const path = require('path');
const app = new Koa();

const routing = require('./routes');

const { connectionStr } = require('./config');
mongoose.connect(connectionStr, { useNewUrlParser: true } , ()=>console.log("MongDB 连接成功了"));
mongoose.connection.on('error', console.error);

app.use(koaStatic(path.join(__dirname, 'public')));
app.use(error({
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}));

app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '/public/uploads'),
        keepExtensions: true // 保留拓展名
    }
})); // 获取请求body

app.use(parameter(app)); // 检验参数
routing(app);

app.listen(4000, () => console.log('zhihu is runnning at PORT 4000'));


