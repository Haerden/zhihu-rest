const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const parameter = require('koa-parameter');
const error = require('koa-json-error');
const app = new Koa();

const routing = require('./routes');

app.use(error({
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}));
app.use(bodyParser()); // 获取请求body
app.use(parameter(app)); // 检验参数
routing(app);

app.listen(4000, () => console.log('is runnning at PORT 4000'));


