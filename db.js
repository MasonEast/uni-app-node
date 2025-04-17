const mongoose = require("mongoose");

// MongoDB 连接配置
const dbConfig = {
  host: "localhost", // 数据库地址
  port: 27017, // 数据库端口
  dbName: "uni-app", // 数据库名称
  user: "", // 用户名(如果有)
  pass: "", // 密码(如果有)
};

// 构建连接字符串
const mongoUrl = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;

// 连接选项
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: dbConfig.user,
  pass: dbConfig.pass,
};

// 连接 MongoDB
mongoose
  .connect(mongoUrl, options)
  .then(() => console.log("MongoDB 连接成功"))
  .catch((err) => console.error("MongoDB 连接失败:", err));

// 监听连接事件
mongoose.connection.on("connected", () => {
  console.log("Mongoose 已连接到 MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose 连接错误:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose 已断开连接");
});

// 导出 mongoose 实例
module.exports = mongoose;
