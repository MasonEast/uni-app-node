const Router = require("koa-router");
const path = require("path");
const fs = require("fs");
const router = new Router();

const { uploadDir, protocol, staticPhotoPath } = require("../config");
const { getIPAddress } = require("../utils");

const File = require("../models/file");

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
        const newImage = new File({
          name: file.name,
          path: file.path,
          contentType: file.mimetype,
          size: file.size,
        });

        await newImage.save();

        return {
          id: newImage._id,
          fileName: file.name,
          filePath: file.path,
        };
      })
    );

    ctx.body = {
      code: 200,
      data: results.map(
        (item) =>
          `${protocol}://${getIPAddress()}:3000/uploads/${item.fileName}`
      ),
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
});

router.get("/uploads/:filename", async (ctx) => {
  const { filename } = ctx.params;
  const filePath = path.join(uploadDir, filename);

  ctx.set("Content-Type", "image/jpeg");
  ctx.body = fs.createReadStream(filePath);
});

router.get("/static/:filename", async (ctx) => {
  const { filename } = ctx.params;
  const filePath = path.join(staticPhotoPath, filename);

  ctx.set("Content-Type", "image/jpeg");
  ctx.body = fs.createReadStream(filePath);
});

module.exports = router;
