const Router = require('koa-router');
// const router = new Router({prefix: '/users'});
const router = new Router();
const { find, findById , update , create, delete: del} = require('../controllers/users');

router.get('/users', find);

router.get('/users/:id', findById);

// 整体替换一项 put=(patch)=> 一部分（名称或密码）
router.patch('/users/:id', update);

router.post('/users', create);

router.delete('/users/:id', del);

module.exports = router;