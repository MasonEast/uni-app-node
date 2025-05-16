const Router = require("koa-router");
const router = new Router();
const auth = require("../middlewares/auth"); // 引入认证中间件


const DynamicController = require("../controllers/DynamicController");

router.get("/api/dynamic/list", async (ctx) => {
  return await DynamicController.getDynamics(ctx);
});

router.get("/api/dynamic/detail/:id", async (ctx) => {
  return await DynamicController.getDynamicById(ctx);
});

router.post("/api/dynamic/create", auth, async (ctx) => {
  return await DynamicController.createDynamic(ctx);
});

router.put("/api/dynamic/views/:id", auth, async (ctx) => {
  return await DynamicController.updateDynamicViews(ctx);
});

router.put("/api/dynamic/likes/:id", auth, async (ctx) => {
  return await DynamicController.updateDynamicLikes(ctx);
});

router.put("/api/dynamic/comments/:id", auth, async (ctx) => {
  return await DynamicController.updateDynamicComments(ctx);
});

router.put("/api/dynamic/collects/:id", auth, async (ctx) => {
    return await DynamicController.updateDynamicCollects(ctx);
  });

// 报名
router.post("/api/dynamic/register", auth, async (ctx) => {
  return await DynamicController.registerDynamic(ctx);
});

module.exports = router;
