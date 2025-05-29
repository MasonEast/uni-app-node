const Router = require("koa-router");
const path = require("path");
const fs = require("fs");
const router = new Router();
const auth = require("../middlewares/auth"); // 引入认证中间件

const { protocol, uploadUrl } = require("../config");
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

// 报名
router.post("/api/post/register", auth, async (ctx) => {
  return await PostController.registerPost(ctx);
});

router.get("/api/post/photos", async (ctx) => {
  ctx.body = {
    code: 200,
    success: true,
    data: [
      {
        title: "户外活动",
        imgs: [
          `${uploadUrl}/static/5.jpg`,
          `${uploadUrl}/static/6.jpg`,
          `${uploadUrl}/static/7.jpg`,
          `${uploadUrl}/static/8.jpg`,
        ],
      },
      {
        title: "户外活动",
        imgs: [
          `${uploadUrl}/static/5.jpg`,
          `${uploadUrl}/static/6.jpg`,
          `${uploadUrl}/static/7.jpg`,
          `${uploadUrl}/static/8.jpg`,
        ],
      },
      {
        title: "户外活动",
        imgs: [
          `${uploadUrl}/static/5.jpg`,
          `${uploadUrl}/static/6.jpg`,
          `${uploadUrl}/static/7.jpg`,
          `${uploadUrl}/static/8.jpg`,
        ],
      },
      {
        title: "户外活动",
        imgs: [
          `${uploadUrl}/static/5.jpg`,
          `${uploadUrl}/static/6.jpg`,
          `${uploadUrl}/static/7.jpg`,
          `${uploadUrl}/static/8.jpg`,
        ],
      },
      {
        title: "户外活动",
        imgs: [
          `${uploadUrl}/static/5.jpg`,
          `${uploadUrl}/static/6.jpg`,
          `${uploadUrl}/static/7.jpg`,
          `${uploadUrl}/static/8.jpg`,
        ],
      },
    ],
  };
});

module.exports = router;
