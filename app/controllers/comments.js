const Comment = require('../model/comments');

class CommentsCtl {
    // 评论列表
    async find(ctx) {
        // 分页
        const { per_page = 3 } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        const { questionId, answerId } = ctx.params;
        ctx.body = await Comment
            .find({ content: q, questionId, answerId })
            .limit(perPage).skip(page * perPage)
            .populate('commentator');
    }

    // 中间件：检查Comment存在与否
    async checkCommentExist(ctx, next) {
        const comment = await Comment.findById(ctx.params.id).select('+commentator');

        if (!comment) {
            ctx.throw(404, 'comment 不存在');
        }
        // 路由中有问题时才检查，答案是否在问题下；赞和踩答案不检查
        if (ctx.params.questionId && comment.questionId !== ctx.params.questionId) {
            ctx.throw(404, '该问题下 没有此评论');
        }

        if (ctx.params.answerId && comment.answerId !== ctx.params.answerId) {
            ctx.throw(404, '该答案下 没有此评论');
        }

        ctx.state.comment = comment;
        await next();
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query;

        const selectFields = fields.split(';').filter(f => f).map(f => `+${f}`).join('');

        const comment = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator');
        ctx.body = comment;

    }

    async create(ctx) {
        // 校验请求体
        ctx.verifyParams({
            content: { type: 'string', required: true }
        });

        const { questionId, answerId } = ctx.params;
        // const { content } = ctx.request.body;
        const commentator = ctx.state.user._id;

        const comment = await new Comment({
            ...ctx.request.body, commentator, questionId, answerId
        }).save(); // 添加要save

        ctx.body = comment;
    }

    // 检查评论人
    async checkCommentator(ctx, next) {
        const { comment } = ctx.state;

        if (comment.commentator.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限更改评论');
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
        await Comment.findByIdAndRemove(ctx.params.id);

        ctx.status = 204; // 成功处理，但没有返回任何内容。
    }
}

module.exports = new CommentsCtl();