//1 schma 2 controls 3 路由
const Topic = require('../model/topics');
// const { secret } = require('../config');

class TopicsCtl {
    async find(ctx) {
        ctx.body = await Topic.find();
    }

    async findById(ctx) {
        const { fields } = ctx.query;

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

        const topic = Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body);

        ctx.body = topic; //(更新前的topic)

    }

}

module.exports = new TopicsCtl();