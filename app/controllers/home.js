class HomeCtl {
    index(ctx) {
        ctx.body = '<h3>This is home page.</h3>';
    }

    // 根目录上传图片
    upload(ctx) {
        const file = ctx.request.files.file;
        ctx.body = {
            path: file.path
        }
    }
}

module.exports = new HomeCtl();