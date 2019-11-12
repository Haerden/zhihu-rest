//1 schma 2 controls 3 路由
const Question = require('../model/questions');
const User = require('../model/users');
// const { secret } = require('../config');

class QuestionsCtl {
    async find(ctx) {
        // 分页
        const { per_page = 3 } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        ctx.body = await Question
            .find({ $or: [{ title: q }, { description: q }] })
            .limit(perPage).skip(page * perPage);
    }

    // 中间件：检查Question存在与否
    async checkQuestionExist(ctx, next) {
        const question = await Question.findById(ctx.params.id).select('+questioner');

        if (!question) {
            ctx.throw(404, 'question 不存在');
        }

        ctx.state.question = question;
        await next();
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query;

        const selectFields = fields.split(';').filter(f => f).map(f => `+${f}`).join('');

        const question = await Question.findById(ctx.params.id).select(selectFields).populate('questioner topics');
        ctx.body = question;

    }

    async create(ctx) {
        // 校验请求体
        ctx.verifyParams({
            title: { type: 'string', required: true },
            description: { type: 'string', required: false }
        });

        const question = await new Question({ ...ctx.request.body, questioner: ctx.state.user._id })
            .save(); // 添加要save

        ctx.body = question;
    }

    // 提问者是否是当前的用户
    async checkQuestioner(ctx, next) {
        const { question } = ctx.state;

        if (question.questioner.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限更改问题');
        }

        await next();
    }

    async update(ctx) {
        // 校验请求体
        ctx.verifyParams({
            name: { type: 'string', required: false },
            description: { type: 'string', required: false }
        });

        // const question = await Question.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        await ctx.state.question.update(ctx.request.body);

        if (!ctx.state.question) {
            ctx.throw(404, 'id 不存在');
        }

        ctx.body = ctx.state.question; //(更新前的question ?)

    }
    async delete(ctx) {
        await Question.findByIdAndRemove(ctx.params.id);

        ctx.status = 204; // 成功处理，但没有返回任何内容。
    }
}

module.exports = new QuestionsCtl();