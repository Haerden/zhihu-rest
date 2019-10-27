// const db = [{ name: "li lei" }];
const User = require('../model/users');

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
            name: { type: 'string', required: true }
        })

        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }

    async update(ctx) {

        const user = await User.findByIdAndUpdate(ctx.params.id,ctx.request.body);

        if(!user) {
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
}

module.exports = new UsersCtl();