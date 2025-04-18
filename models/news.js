const mongoose = require("mongoose");
const { Schema } = mongoose;

// 用户模型
const newSchema = new Schema({
  _id: ObjectId,
  recipientId: ObjectId, // 接收用户ID
  senderId: ObjectId, // 发送用户ID
  senderInfo: {
    // 冗余存储发送者信息
    nickname: String,
    avatarUrl: String,
  },
  type: String, // 'like', 'comment', 'reply', 'system'
  targetType: String, // 'post' 或 'comment'
  targetId: ObjectId, // 关联的帖子或评论ID
  content: String, // 消息内容
  isRead: Boolean,
  createdAt: Date,
});

module.exports = mongoose.model("News", newSchema);
