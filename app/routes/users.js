const jsonwebtoken = require('jsonwebtoken');
const Router = require('koa-router');
// const router = new Router({prefix: '/users'});
const router = new Router();
const { find, findById, update, create,
    delete: del, login, checkOwner
} = require('../controllers/users');

const { secret } = require('../config');

// auth
const auth = async (ctx, next) => {
    const { authorization = '' } = ctx.request.header;

    const token = authorization.replace('Bearer ', '');

    try {
        // 验证token有没有被篡改过
        const user = jsonwebtoken.verify(token, secret);
        ctx.state.user = user;
    } catch (error) {
        ctx.throw(401, error.message);
    }

    await next();
}

router.get('/users', find);

router.get('/users/:id', findById);

// 整体替换一项 put=(patch)=> 一部分（名称或密码）
router.patch('/users/:id', auth, checkOwner, update);

router.post('/users', create);

router.delete('/users/:id', auth, checkOwner, del); //认证＝>授权

router.post('/users/login', login);

module.exports = router;