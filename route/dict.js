const Router = require("koa-router");

const router = new Router();

const { getDictArr } = require("../utils/dict");

// 获取字典选项接口
router.get("/api/dict/:dictName", async (ctx) => {
  const { dictName } = ctx.params;
  const options = getDictArr(dictName);

  ctx.body = { code: 200, data: options };
});

module.exports = router;
