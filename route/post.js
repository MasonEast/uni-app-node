const Router = require("koa-router");
const path = require("path");
const fs = require("fs");
const router = new Router();
const auth = require("../middlewares/auth"); // 引入认证中间件

const { protocol } = require("../config");
const { getIPAddress } = require("../utils");

const PostController = require("../controllers/PostController");

router.get("/api/post/list", async (ctx) => {
  return await PostController.getPosts(ctx);
});

router.get("/api/post/detail/:id", async (ctx) => {
  return await PostController.getPostById(ctx);
});

router.post("/api/post/create", auth, async (ctx) => {
  return await PostController.createPost(ctx);
});

router.get("/api/post/photos", async (ctx) => {
  ctx.body = {
    code: 200,
    success: true,
    data: [
      {
        title: "户外活动",
        imgs: [
          `${protocol}://${getIPAddress()}:3000/static/5.jpg`,
          `${protocol}://${getIPAddress()}:3000/static/6.jpg`,
          `${protocol}://${getIPAddress()}:3000/static/7.jpg`,
          `${protocol}://${getIPAddress()}:3000/static/8.jpg`,
        ],
      },
      {
        title: "户外活动",
        imgs: [
          `${protocol}://${getIPAddress()}:3000/static/5.jpg`,
          `${protocol}://${getIPAddress()}:3000/static/6.jpg`,
          `${protocol}://${getIPAddress()}:3000/static/7.jpg`,
          `${protocol}://${getIPAddress()}:3000/static/8.jpg`,
        ],
      },
      {
        title: "户外活动",
        imgs: [
          `${protocol}://${getIPAddress()}:3000/static/5.jpg`,
          `${protocol}://${getIPAddress()}:3000/static/6.jpg`,
          `${protocol}://${getIPAddress()}:3000/static/7.jpg`,
          `${protocol}://${getIPAddress()}:3000/static/8.jpg`,
        ],
      },
      {
        title: "户外活动",
        imgs: [
          `${protocol}://${getIPAddress()}:3000/static/5.jpg`,
          `${protocol}://${getIPAddress()}:3000/static/6.jpg`,
          `${protocol}://${getIPAddress()}:3000/static/7.jpg`,
          `${protocol}://${getIPAddress()}:3000/static/8.jpg`,
        ],
      },
      {
        title: "户外活动",
        imgs: [
          `${protocol}://${getIPAddress()}:3000/static/5.jpg`,
          `${protocol}://${getIPAddress()}:3000/static/6.jpg`,
          `${protocol}://${getIPAddress()}:3000/static/7.jpg`,
          `${protocol}://${getIPAddress()}:3000/static/8.jpg`,
        ],
      },
    ],
  };
});

module.exports = router;
