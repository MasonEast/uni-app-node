const Router = require("koa-router");
const path = require("path");
const fs = require("fs");
const router = new Router();
const auth = require("../middlewares/auth"); // 引入认证中间件
const { createComment, replyComment, getComments } = require('../controllers/CommentController');


router.post("/api/comment/create", auth, async (ctx) => {
  return await createComment(ctx);
});

// 回复评论
router.post('/api/comment/:commentId/reply', auth, async (ctx) => {
  return await replyComment(ctx);
});

// 获取文章评论列表（带分页）
router.get('/api/comment/:dynamicId', async (ctx) => {
  return await getComments(ctx);
});



module.exports = router;
