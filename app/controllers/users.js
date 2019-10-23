const db = [{ name: "li lei" }];

class UsersCtl {
    find(ctx) {
        a.b
        ctx.body = db;
    }

    findById(ctx) {
        ctx.body = db[ctx.params.id];
    }

    create(ctx) {
        db.push(ctx.request.body);
        ctx.body = ctx.request.body;
    }

    update(ctx) {
        db[ctx.params.id * 1] = ctx.request.body;
        ctx.body = ctx.request.body;
    }

    delete(ctx) {
        db.splice(ctx.params.id * 1, 1);
        ctx.status = 204; //204 代表没有内容
    }
}

module.exports = new UsersCtl();