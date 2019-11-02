const path = require('path');

class HomeCtl {
    index(ctx) {
        ctx.body = '<h3>This is home page.</h3>';
    }

    // 根目录上传图片
    upload(ctx) {
        const file = ctx.request.files.file;
        const basename = path.basename(file.path);

        ctx.body = {
            url: `${ctx.origin}/uploads/${basename}`
        }
    }
}

module.exports = new HomeCtl();