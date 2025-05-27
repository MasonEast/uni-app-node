const Message = require('../models/message');

class MessageController {
  // 获取消息列表（支持分页和类型过滤）
//   static async getMessages(ctx) {
//     try {
//       const { type, page = 1, limit = 100 } = ctx.query;
//       const userId = ctx.state.user.openid; // 从JWT中获取用户ID[9](@ref)
      
//       const query = { userId };
//         if (!type) {
//             // 并行查询三种类型的最新消息
//             const [interactive, system, activity] = await Promise.all([
//                 Message.find({ userId, type: 'interactive' })
//                 .sort({ createdAt: -1 })
//                 .limit(Number(limit)),
//                 Message.find({ userId, type: 'system' })
//                 .sort({ createdAt: -1 })
//                 .limit(Number(limit)),
//                 Message.find({ userId, type: 'activity' })
//                 .sort({ createdAt: -1 })
//                 .limit(Number(limit))
//             ]);

//             ctx.body = {
//                 code: 200,
//                 data: {
//                 interactive,
//                 system,
//                 activity
//                 }
//             };
//             return;

//       }
        
//       query.type = type;

//       const messages = await Message.find(query)
//         .sort({ createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(Number(limit)); // 分页逻辑[3](@ref)

//       ctx.body = { code: 200, data: messages };
//     } catch (err) {
//       ctx.status = 500;
//       ctx.body = { code: -1, message: '获取消息失败' };
//     }
//   }
static async getMessages(ctx) {
  try {
    const { type, page = 1, limit = 100 } = ctx.query;
    const userId = ctx.state.user.openid;

    // 通用查询条件
    const baseQuery = { userId, isRead: false };
    const projection = { isRead: 1, type: 1 };

    // 未指定类型时返回分类消息
    if (!type) {
      const [interactive, system, activity, unreadCounts] = await Promise.all([
        // 各分类消息列表
        Message.find({ userId, type: 'interactive' })
          .sort({ createdAt: -1 })
          .limit(Number(limit)),
        Message.find({ userId, type: 'system' })
          .sort({ createdAt: -1 })
          .limit(Number(limit)),
        Message.find({ userId, type: 'activity' })
          .sort({ createdAt: -1 })
          .limit(Number(limit)),
        // 各分类未读数聚合查询
        Message.aggregate([
          { $match: { userId } },
          { 
            $group: {
              _id: "$type",
              count: { $sum: { $cond: [{ $eq: ["$isRead", false] }, 1, 0] } }
            }
          }
        ])
      ]);

      // 转换为未读数映射表
      const unreadMap = unreadCounts.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {});

      ctx.body = {
        code: 200,
        data: {
          interactive: {
            list: interactive,
            unread: unreadMap.interactive || 0
          },
          system: {
            list: system,
            unread: unreadMap.system || 0
          },
          activity: {
            list: activity,
            unread: unreadMap.activity || 0
          },
          totalUnread: Object.values(unreadMap).reduce((a, b) => a + b, 0)
        }
      };
      return;
    }

    // 指定类型时的分页查询
    const query = { userId, type };
    
    const [messages, totalUnread] = await Promise.all([
      Message.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Message.countDocuments({ ...query, isRead: false })
    ]);

    ctx.body = {
      code: 200,
      data: {
        list: messages,
        unread: totalUnread,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: await Message.countDocuments(query)
        }
      }
    };
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
      ctx.body = { code: 200, message: '标记成功' };
    } catch (err) {
      ctx.body = { code: -1, message: '更新失败' };
    }
  }

  static async markAllAsRead(ctx) {
    try {
        const { type } = ctx.request.body;
        const userId = ctx.state.user.openid;

        // 构建更新条件
        const filter = { 
        userId,
        isRead: false
        };
        if (type) filter.type = type;

        // 执行批量更新
        const result = await Message.updateMany(
        filter,
        { $set: { isRead: true } }
        );

        ctx.body = {
        code: 200,
        data: {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        }
        };
    } catch (err) {
        ctx.status = 500;
        ctx.body = { 
        code: -1, 
        message: '标记已读失败',
        debug: process.env.NODE_ENV === 'development' ? err.message : undefined
        };
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