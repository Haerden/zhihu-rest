const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({ prefix: '/topics' });
// const router = new Router();

const { find, findById, update, create,
    checkTopicExist, listFollowers
} = require('../controllers/topics');

const { secret } = require('../config');

const auth = jwt({ secret });

router.get('/', find);

router.post('/', auth, create);

router.get('/:id', findById);

router.patch('/:id', auth, checkTopicExist,update);

router.get('/:id/followers', checkTopicExist,listFollowers);

module.exports = router;