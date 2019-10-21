class HomeCtl {
    index(ctx) {
        ctx.body = '<h3>This is home page.</h3>';
    }
}

module.exports = new HomeCtl();