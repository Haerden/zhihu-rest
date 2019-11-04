const Topic = require('../model/topics');
// const { secret } = require('../config');

class TopicsCtl {
    async find(ctx) {
        ctx.body = await Topic.find();
    }

}

module.exports = new TopicsCtl();