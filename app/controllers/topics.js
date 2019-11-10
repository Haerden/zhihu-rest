//1 schma 2 controls 3 路由
const Topic = require('../model/topics');
const User = require('../model/users');
// const { secret } = require('../config');

class TopicsCtl {
    async find(ctx) {
        // 分页
        const { per_page = 3 } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        ctx.body = await Topic
            .find({ name: new RegExp(ctx.query.q) })
            .limit(perPage).skip(page * perPage);
    }

    // 中间件：检查Topic存在与否
    async checkTopicExist(ctx, next) {
        const topic = await Topic.findById(ctx.params.id);

        if (!topic) {
            ctx.throw(404, 'Topic 不存在');
        }

        await next();
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query;

        const selectFields = fields.split(';').filter(f => f).map(f => `+${f}`).join('');

        const topic = await Topic.findById(ctx.params.id).select(selectFields);
        ctx.body = topic;

    }

    async create(ctx) {
        // 校验请求体
        ctx.verifyParams({
            name: { type: 'string', required: true },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false }
        });

        const topic = await new Topic(ctx.request.body).save(); // 添加要save

        ctx.body = topic;
    }

    async update(ctx) {
        // 校验请求体
        ctx.verifyParams({
            name: { type: 'string', required: false },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false }
        });

        const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body);

        if (!topic) {
            ctx.throw(404, 'id 不存在');
        }

        ctx.body = topic; //(更新前的topic)

    }
    async listFollowers(ctx) {
        // 话题里面包含该id话题的用户
        const users = await User.find({ followingTopics: ctx.params.id});

        ctx.body = users;
    }
}

module.exports = new TopicsCtl();