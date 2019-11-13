const Answer = require('../model/answers');
const User = require('../model/users');
// const { secret } = require('../config');

class AnswersCtl {
    async find(ctx) {
        // 分页
        const { per_page = 3 } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        ctx.body = await Answer
            .find({ content: q, questionId: ctx.params.questionId })
            .limit(perPage).skip(page * perPage);
    }

    // 中间件：检查Answer存在与否
    async checkAnswerExist(ctx, next) {
        const answer = await Answer.findById(ctx.params.id).select('+answerer');

        if (!answer) {
            ctx.throw(404, 'answer 不存在');
        }
        // 路由中有问题时才检查，答案是否在问题下；赞和踩答案不检查
        if (ctx.params.questionId && answer.questionId !== ctx.params.questionId) {
            ctx.throw(404, '该问题下 没有此答案');
        }

        ctx.state.answer = answer;
        await next();
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query;

        const selectFields = fields.split(';').filter(f => f).map(f => `+${f}`).join('');

        const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer');
        ctx.body = answer;

    }

    async create(ctx) {
        // 校验请求体
        ctx.verifyParams({
            content: { type: 'string', required: true }
        });

        const answer = await new Answer({
            ...ctx.request.body,
            answerer: ctx.state.user._id,
            questionId: ctx.params.questionId
        })
            .save(); // 添加要save

        ctx.body = answer;
    }

    // 提问者是否是当前的用户
    async checkAnswerer(ctx, next) {
        const { answer } = ctx.state;

        if (answer.answerer.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限更改答案');
        }

        await next();
    }

    async update(ctx) {
        // 校验请求体
        ctx.verifyParams({
            content: { type: 'string', required: false }
        });


        await ctx.state.answer.update(ctx.request.body);

        if (!ctx.state.answer) {
            ctx.throw(404, 'id 不存在');
        }

        ctx.body = ctx.state.answer; //(更新前的answer ?)

    }

    async delete(ctx) {
        await Answer.findByIdAndRemove(ctx.params.id);

        ctx.status = 204; // 成功处理，但没有返回任何内容。
    }
}

module.exports = new AnswersCtl();