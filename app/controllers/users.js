// const db = [{ name: "li lei" }];
const jsonwebtoken = require('jsonwebtoken');
const User = require('../model/users');
const { secret } = require('../config');

class UsersCtl {
    async find(ctx) {
        ctx.body = await User.find();
    }

    async findById(ctx) {
        const user = await User.findById(ctx.params.id);
        if (!user) { ctx.throw(404, '用户不存在'); }

        ctx.body = user;
    }

    async create(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true }
        });

        const { name } = ctx.request.body;
        const repeatUser = await User.findOne({ name });
        if (repeatUser) {
            ctx.throw(409, '用户已经存在');
        }

        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }

    // 检查是否是本人
    async checkOwner(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '没有权限');
        }

        await next();
    }

    async update(ctx) {
        // 更新个人资料的参数校验
        ctx.verifyParams({
            name: { type: 'string', required: false },
            password: { type: 'string', required: false },
            avatar_url: { type: 'string', required: false },
            gender: { type: 'string', required: false },
            headline: { type: 'string', required: false },
            locations: { type: 'array', itemType: 'string', required: false },
            business: { type: 'string', required: false },
            employments: { type: 'array', itemType: 'object', required: false },
            educations: { type: 'array', itemType: 'object', required: false }
        });

        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);

        if (!user) {
            ctx.throw(404, 'id 不存在');
        }

        ctx.body = user;
    }

    async delete(ctx) {
        const user = await User.findByIdAndDelete(ctx.params.id);
        if (!user) {
            ctx.throw(404, '用户不存在');
        }

        ctx.body = user;
    }

    async login(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true }
        });

        const user = await User.findOne(ctx.request.body);
        if (!user) {
            ctx.throw(401, '用户名或密码不正确');
        }

        const { _id, name } = user;
        const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' });
        ctx.body = { token };
    }
}

module.exports = new UsersCtl();