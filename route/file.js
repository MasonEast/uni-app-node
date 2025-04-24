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

router.post("/api/upload/file", async (ctx) => {
  const files = ctx.request.files.file;

  if (!files) {
    ctx.status = 400;
    ctx.body = { error: "No file uploaded" };
    return;
  }

  try {
    // 处理单个或多个文件
    const uploadedFiles = Array.isArray(files) ? files : [files];

    const results = await Promise.all(
      uploadedFiles.map(async (file) => {
        const ext = path.extname(file.originalFilename);
        const filename = `${uuidv4()}${ext}`;
        const filePath = path.join(uploadDir, filename);

        const newImage = new File({
          name: file.originalFilename,
          path: filename,
          contentType: file.mimetype,
          size: file.size,
        });

        await newImage.save();

        return {
          id: newImage._id,
          fileName: filename,
          fileUrl: filePath,
        };
      })
    );

    ctx.body = {
      code: 200,
      message: "文件上传成功",
      data: {
        files: results,
        formData: ctx.request.body,
      },
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
});

module.exports = router;
