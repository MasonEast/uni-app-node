const mongoose = require("mongoose");
const { Schema } = mongoose;

// 用户模型
const messageSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true }, // 关联用户ID[5,9](@ref)
  type: { 
    type: String, 
    enum: ['interactive', 'system', 'activity'], // 消息类型[8](@ref)
    required: true 
  },
  title: { type: String, required: false },     // 消息标题
  content: { type: String, required: true },     // 消息内容
  isRead: { type: Boolean, default: false },     // 是否已读[8](@ref)
  relatedId: Schema.Types.ObjectId,     // 关联业务ID（如互动对象ID）
  metadata: Schema.Types.Mixed,         // 扩展字段（如活动链接）[2](@ref)
  createdAt: { type: Date, default: Date.now },   // 创建时间[5](@ref)

  template: String, // 模板标识符如 "activity_join"
  variables: mongoose.Schema.Types.Mixed // 动态参数
});

module.exports = mongoose.model("Message", messageSchema);
