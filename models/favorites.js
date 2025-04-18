const mongoose = require("mongoose");
const { Schema } = mongoose;

// 用户模型
const favoriteSchema = new Schema({
  _id: ObjectId,
  userId: ObjectId, // 关联users._id
  postId: ObjectId, // 关联posts._id
  createdAt: Date,
});

module.exports = mongoose.model("Favorites", favoriteSchema);
