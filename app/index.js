const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

const routing = require('./routes');



app.use(bodyParser()); // 获取请求body
routing(app);

app.listen(4000, () => console.log('is runnning at PORT 4000'));


