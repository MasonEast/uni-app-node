const Router = require("koa-router");
const router = new Router();
const auth = require("../middlewares/auth"); // 引入认证中间件

const MessageController = require('../controllers/MessageController');

router.prefix('/api/message');

// 需要认证的接口
router.use(auth);

router.get('/list', MessageController.getMessages);
router.post('/mark-read', MessageController.markAsRead);

router.post('/mark-all-read', MessageController.markAllAsRead);
// 管理员专属接口
router.post('/system-notify', auth, MessageController.createSystemNotify);

// 获取消息统计信息
router.get('/stats', MessageController.getMessageStats); 

module.exports = router;
