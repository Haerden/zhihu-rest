const db = [{ name: "li lei" }];

class UsersCtl {
    find(ctx) {
        ctx.body = db;
    }

    findById(ctx) {
        ctx.body = db[ctx.params.id];
    }

    create(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            age: { type: 'number', required: false }
        })

        db.push(ctx.request.body);
        ctx.body = ctx.request.body;
    }

    update(ctx) {
        if (ctx.params.id >= db.length) {
            ctx.throw(412);
        }

        db[ctx.params.id * 1] = ctx.request.body;
        ctx.body = ctx.request.body;
    }

    delete(ctx) {
        if (ctx.params.id >= db.length) {
            ctx.throw(412);
        }

        db.splice(ctx.params.id * 1, 1);
        ctx.status = 204; //204 代表没有内容
    }
}

module.exports = new UsersCtl();