const jwt = require('koa-jwt');
const Router = require('koa-router');
// const router = new Router({prefix: '/users'});
const router = new Router();
const { find, findById, update, create,
    delete: del, login, checkOwner, listFollowing, listFollowers,
    checkUserExist, follow, unfollow,
    followTopic, unfollowTopic, listFollowingTopics,
    listQuestions
} = require('../controllers/users');

const { checkTopicExist } = require('../controllers/topics');

const { secret } = require('../config');

// auth
const auth = jwt({ secret });

router.get('/users', find);

router.get('/users/:id', findById);

// 整体替换一项 <=put (patch)=> 一部分（名称或密码）
router.patch('/users/:id', auth, checkOwner, update);

router.post('/users', create);

router.delete('/users/:id', auth, checkOwner, del); //认证＝>授权

router.post('/users/login', login);

router.get('/users/:id/following', listFollowing); // 关注列表

router.get('/users/:id/followers', listFollowers); // 粉丝列表

router.put('/users/following/:id', auth, checkUserExist, follow); // 添加关注人

router.delete('/users/following/:id', auth, checkUserExist, unfollow); // 取消关注人

router.get('/users/:id/followingTopics', listFollowingTopics); // 关注的话题列表

router.put('/users/followingTopics/:id', auth, checkTopicExist, followTopic); // 添加关注话题

router.delete('/users/followingTopics/:id', auth, checkTopicExist, unfollowTopic); // 取消关注话题

router.get('/users/:id/questions', checkUserExist, listQuestions); // 关注问题列表

module.exports = router;