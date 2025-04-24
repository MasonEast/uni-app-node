const mongoose = require("mongoose");
const { Schema } = mongoose;

// 用户模型
const fileSchema = new Schema({
  // _id: ObjectId,
  name: String,
  path: String,
  contentType: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", fileSchema);
