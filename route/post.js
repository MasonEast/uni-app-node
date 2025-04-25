const Router = require("koa-router");
const path = require("path");
const fs = require("fs");
const router = new Router();
const auth = require("../middlewares/auth"); // 引入认证中间件

const PostController = require("../controllers/PostController");

router.get("/api/post/list", async (ctx) => {
  return await PostController.getPosts(ctx);
});

router.post("/api/post/create", auth, async (ctx) => {
  return await PostController.createPost(ctx);
});

module.exports = router;
