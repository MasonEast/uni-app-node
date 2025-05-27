const path = require("path");
const { getIPAddress } = require("../utils");

const uploadDir = path.join(__dirname, "..", "uploads");

const protocol = "http";
const port = 3000;

const config = {
  appid: "wx64e3f8818fd4ab9c",
  secret: "12909862180c39e485497a54820e9f80",
  jwtSecret: "gaglghbnv,micc",
  expiresIn: "15d", // 15天有效期
  uploadDir,
  protocol,
  staticPhotoPath: path.join(__dirname, "..", "static", "photos"), // 静态资源图片路径
  port,
//   uploadUrl: `${protocol}://${getIPAddress()}:${port}/uploads`,
  uploadUrl: `https://qgtu108894877.vicp.fun/uploads`,
};


module.exports = config;
