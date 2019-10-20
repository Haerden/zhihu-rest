const Router = require('koa-router');
// const router = new Router({prefix: '/users'});
const router = new Router();

const db = [{ name: "li lei" }];

router.get('/users', (ctx) => {
    console.log('?q:', ctx.query);
    // ctx 
    ctx.set('Allow', 'GET POST')
    // ctx.body = [{ name: 'li lei' }, { name: 'han meimei' }];
    ctx.body = db;
})

router.get('/users/:id', ctx => {
    console.log('params is:', ctx.params, db[0]);

    ctx.body = db[ctx.params.id];
});

// 整体替换一项
router.put('/users/:id', ctx => {
    db[ctx.params.id * 1] = ctx.request.body;
    ctx.body = ctx.request.body;
});
// router.post('/users/:id', ctx =>
//     ctx.body = ctx.params.id
// );

router.post('/users', ctx => {
    // console.log('reqBody:', ctx.request.body);
    // console.log('reqHeader:', ctx.header);
    db.push(ctx.request.body);
    ctx.body = ctx.request.body;
});

router.delete('/users/:id', ctx => {
    db.splice(ctx.params.id * 1, 1);
    ctx.status = 204; //204 代表没有内容
});

module.exports = router;