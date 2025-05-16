const Message = require('../models/message');

class MessageController {
  // 获取消息列表（支持分页和类型过滤）
  static async getMessages(ctx) {
    try {
      const { type, page = 1, limit = 10 } = ctx.query;
      const userId = ctx.state.user.id; // 从JWT中获取用户ID[9](@ref)
      
      const query = { userId };
      if (type) query.type = type;

      const messages = await Message.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)); // 分页逻辑[3](@ref)

      ctx.body = { code: 0, data: messages };
    } catch (err) {
      ctx.status = 500;
      ctx.body = { code: -1, message: '获取消息失败' };
    }
  }

  // 标记消息为已读（支持批量）
  static async markAsRead(ctx) {
    try {
      const { messageIds } = ctx.request.body;
      await Message.updateMany(
        { _id: { $in: messageIds } },
        { $set: { isRead: true } } // 批量更新操作[5](@ref)
      );
      ctx.body = { code: 0 };
    } catch (err) {
      ctx.body = { code: -1, message: '更新失败' };
    }
  }

  // 创建系统通知（管理员接口示例）
  static async createSystemNotify(ctx) {
    try {
      const { userIds, content } = ctx.request.body;
      const messages = userIds.map(userId => ({ 
        userId, 
        type: 'system',
        content 
      }));
      
      await Message.insertMany(messages); // 批量插入[5](@ref)
      ctx.body = { code: 0 };
    } catch (err) {
      ctx.body = { code: -1, message: '创建失败' };
    }
  }

  // 消息分类统计
  static async getMessageStats(ctx) {
    try {
        const stats = await Message.aggregate([
        { $match: { userId: ctx.state.user.id } },
        { $group: {
            _id: "$type",
            total: { $sum: 1 },
            unread: { 
                $sum: { $cond: [ { $eq: ["$isRead", false] }, 1, 0 ] }
            }
            }
        }
        ]);
        ctx.body = { code: 0, data: stats };
    } catch (err) {
        ctx.status = 500;
        ctx.body = { code: -1, message: '统计失败' };
    }
  }

  static async createMessage(ctx) {
    try {
        const msg = await Message.create(ctx.request.body);
        ctx.app.io.emit(`user_${msg.userId}`, msg); // 触发推送[1,4](@ref)
        ctx.body = { code: 200, data: msg };
    } catch (err) {
        ctx.status = 500;
        ctx.body = { code: -1, message: '创建失败' };
    }
  }
}

module.exports = MessageController;