const Router = require('koa-router');
const router = new Router();

router.get('/', (ctx) => {
    ctx.body = 'This is home page.';
});

module.exports = router;