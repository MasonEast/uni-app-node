const Koa = require("koa");
const app = new Koa();
const koaBodyparser = require("koa-bodyparser");
const routing = require("./route");
require("./db"); // 引入数据库连接
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
