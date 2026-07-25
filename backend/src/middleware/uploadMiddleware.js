const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const multer = require("multer");

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const UPLOADS_DIRECTORY = path.resolve(__dirname, "../../uploads");
const ALLOWED_FILE_TYPES = new Map([
  [".pdf", new Set(["application/pdf"])],
  [".doc", new Set(["application/msword"])],
  [
    ".docx",
    new Set([
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]),
  ],
  [".ppt", new Set(["application/vnd.ms-powerpoint"])],
  [
    ".pptx",
    new Set([
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ]),
  ],
  [".jpg", new Set(["image/jpeg"])],
  [".jpeg", new Set(["image/jpeg"])],
  [".png", new Set(["image/png"])],
  [".gif", new Set(["image/gif"])],
  [".webp", new Set(["image/webp"])],
]);

fs.mkdirSync(UPLOADS_DIRECTORY, { recursive: true });

function getSafeBaseName(originalName) {
  const parsedName = path.parse(originalName);
  const safeName = parsedName.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return safeName || "document";
}

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, UPLOADS_DIRECTORY);
  },
  filename(req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const safeBaseName = getSafeBaseName(file.originalname);

    callback(null, `${Date.now()}-${uniqueSuffix}-${safeBaseName}${extension}`);
  },
});

function fileFilter(req, file, callback) {
  const extension = path.extname(file.originalname).toLowerCase();
  const allowedMimeTypes = ALLOWED_FILE_TYPES.get(extension);

  if (!allowedMimeTypes || !allowedMimeTypes.has(file.mimetype)) {
    const error = new Error(
      "Only PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, PNG, GIF and WEBP files are allowed",
    );
    error.statusCode = 400;
    return callback(error);
  }

  return callback(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
});

function uploadDocumentFile(req, res, next) {
  upload.single("file")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "File size must not exceed 10MB"
          : "Invalid document upload";

      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Failed to upload document",
    });
  });
}

async function removeUploadedFile(storedFileName) {
  if (!storedFileName) {
    return;
  }

  const safeFileName = path.basename(storedFileName);
  const filePath = path.join(UPLOADS_DIRECTORY, safeFileName);

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Failed to remove uploaded file: ${error.message}`);
    }
  }
}

module.exports = {
  removeUploadedFile,
  uploadDocumentFile,
};
