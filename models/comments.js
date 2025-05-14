const mongoose = require("mongoose");
const { Schema } = mongoose;

// 用户模型
const commentSchema = new Schema({
  content: { type: String, required: true }, // 评论内容
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 关联用户
  dynamicId: { type: mongoose.Schema.Types.ObjectId, required: true }, // 关联文章/动态
  replies: [{ // 回复列表（嵌套文档）
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comments", commentSchema);
