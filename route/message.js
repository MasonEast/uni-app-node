const Router = require("koa-router");
const router = new Router();
const auth = require("../middlewares/auth"); // 引入认证中间件

const MessageController = require('../controllers/MessageController');

router.prefix('/api/messages');

// 需要认证的接口
router.use(auth);

router.get('/', MessageController.getMessages);
router.post('/mark-read', MessageController.markAsRead);

// 管理员专属接口
router.post('/system-notify', auth, MessageController.createSystemNotify);

module.exports = router;
