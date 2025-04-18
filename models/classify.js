const mongoose = require("mongoose");
const { Schema } = mongoose;

// 用户模型
const classifySchema = new Schema({
  _id: ObjectId,
  name: String,
  icon: String, // 图标URL或图标类名
  sort: Number, // 排序权重
  status: String, // 'enabled', 'disabled'
  createdAt: Date,
});

module.exports = mongoose.model("Classify", classifySchema);
