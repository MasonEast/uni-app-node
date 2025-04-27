const Koa = require("koa");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const koaBodyparser = require("koa-bodyparser");
const { koaBody } = require("koa-body");
const cors = require("@koa/cors");

const config = require("./config");
const routing = require("./route");
require("./db"); // 引入数据库连接

const app = new Koa();

app.use(cors());
// 处理文件上传
const uploadDir = config.uploadDir; // 上传目录
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(
  koaBody({
    multipart: true, // 支持 multipart-formdata
    formidable: {
      maxFileSize: 200 * 1024 * 1024,
      keepExtensions: true, // 仍然保留扩展名
      uploadDir: path.join(__dirname, "uploads"),
      onFileBegin: (name, file) => {
        console.log("onFileBegin", name, file);
        // 在文件开始处理时重命名文件
        const ext = path.extname(file.originalFilename); // 获取文件扩展名
        const filename = uuidv4() + ext; // 生成UUID + 扩展名
        file.path = path.join(uploadDir, filename); // 修改保存路径
        file.filepath = path.join(uploadDir, filename); // 修改保存路径
        file.name = filename; // 修改文件名
        file.newFilename = filename; // 更新文件名
        file.originalFilename = filename; // 更新原始文件名
        console.log("file.path---------", file);
      },
    },
  })
);

// const router = require("./router");
// 响应
// app.use((ctx) => {
//   ctx.body = "Hello Koa";
// });
app.use(koaBodyparser());
// 注册路由
// app.use(router.routes());

// 自动丰富 response 相应头，当未设置响应状态(status)的时候自动设置，在所有路由中间件最后设置(全局，推荐)，也可以设置具体某一个路由（局部），例如：router.get('/index', router.allowedMethods()); 这相当于当访问 /index 时才设置
// app.use(router.allowedMethods());
routing(app);

app.listen(3000);
