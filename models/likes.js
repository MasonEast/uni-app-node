const mongoose = require("mongoose");
const { Schema } = mongoose;

// 用户模型
const likeSchema = new Schema({
  _id: ObjectId,
  userId: ObjectId, // 关联users._id
  targetType: String, // 'post' 或 'comment'
  targetId: ObjectId, // 关联posts._id或comments._id
  createdAt: Date,
});

module.exports = mongoose.model("Likes", likeSchema);
