const Router = require("koa-router");
const path = require("path");
const fs = require("fs");
const router = new Router();
const { v4: uuidv4 } = require("uuid");

const File = require("../models/file");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.post("/api/upload/image", async (ctx) => {
  const file = ctx.request.files.file;

  if (!file) {
    ctx.status = 400;
    ctx.body = { error: "No file uploaded" };
    return;
  }

  try {
    // 生成唯一文件名
    const ext = path.extname(file.originalFilename);
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(uploadDir, filename);
    console.log(filePath, "filePath", filename);

    const newImage = new File({
      name: file.originalFilename,
      path: filename,
      contentType: file.mimetype,
      size: file.size,
    });

    await newImage.save();

    ctx.body = {
      message: "Image uploaded successfully",
      id: newImage._id,
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
});

module.exports = router;
