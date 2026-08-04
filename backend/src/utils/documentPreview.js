const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);
const UPLOADS_DIRECTORY = path.resolve(__dirname, "../../uploads");
const PREVIEWS_DIRECTORY = path.join(UPLOADS_DIRECTORY, "previews");
const CONVERSION_SCRIPT = path.join(__dirname, "convert-office-preview.ps1");
const OFFICE_EXTENSIONS = new Set([".doc", ".docx", ".ppt", ".pptx"]);
const activeConversions = new Map();

fs.mkdirSync(PREVIEWS_DIRECTORY, { recursive: true });

function getStoredFilePath(storedFileName) {
  return path.join(UPLOADS_DIRECTORY, path.basename(storedFileName));
}

function getPreviewFilePath(storedFileName) {
  const safeStoredName = path.basename(storedFileName);
  return path.join(PREVIEWS_DIRECTORY, `${path.parse(safeStoredName).name}.pdf`);
}

async function isPreviewCurrent(sourcePath, previewPath) {
  try {
    const [sourceStats, previewStats] = await Promise.all([
      fs.promises.stat(sourcePath),
      fs.promises.stat(previewPath),
    ]);

    return previewStats.size > 0 && previewStats.mtimeMs >= sourceStats.mtimeMs;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}

async function convertWithMicrosoftOffice(sourcePath, previewPath) {
  await execFileAsync(
    "powershell.exe",
    [
      "-NoLogo",
      "-NoProfile",
      "-NonInteractive",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      CONVERSION_SCRIPT,
      "-InputPath",
      sourcePath,
      "-OutputPath",
      previewPath,
    ],
    {
      timeout: 120000,
      windowsHide: true,
      maxBuffer: 1024 * 1024,
    },
  );
}

async function convertWithLibreOffice(sourcePath) {
  const command = process.env.LIBREOFFICE_PATH || "libreoffice";

  await execFileAsync(
    command,
    [
      "--headless",
      "--convert-to",
      "pdf",
      "--outdir",
      PREVIEWS_DIRECTORY,
      sourcePath,
    ],
    {
      timeout: 120000,
      windowsHide: true,
      maxBuffer: 1024 * 1024,
    },
  );
}

async function createPreview(sourcePath, previewPath) {
  if (process.platform === "win32") {
    await convertWithMicrosoftOffice(sourcePath, previewPath);
    return;
  }

  await convertWithLibreOffice(sourcePath);
}

async function getOrCreateDocumentPreview(storedFileName) {
  if (!storedFileName) {
    const error = new Error("Document does not have an uploaded file");
    error.statusCode = 404;
    throw error;
  }

  const sourcePath = getStoredFilePath(storedFileName);
  const extension = path.extname(sourcePath).toLowerCase();

  if (!OFFICE_EXTENSIONS.has(extension)) {
    const error = new Error("Document type does not require an Office preview");
    error.statusCode = 400;
    throw error;
  }

  try {
    await fs.promises.access(sourcePath, fs.constants.R_OK);
  } catch {
    const error = new Error("Uploaded document file was not found");
    error.statusCode = 404;
    throw error;
  }

  const previewPath = getPreviewFilePath(storedFileName);

  if (await isPreviewCurrent(sourcePath, previewPath)) {
    return previewPath;
  }

  if (!activeConversions.has(previewPath)) {
    const conversion = createPreview(sourcePath, previewPath)
      .then(async () => {
        if (!(await isPreviewCurrent(sourcePath, previewPath))) {
          throw new Error("Office preview conversion did not produce a valid PDF");
        }

        return previewPath;
      })
      .finally(() => {
        activeConversions.delete(previewPath);
      });

    activeConversions.set(previewPath, conversion);
  }

  return activeConversions.get(previewPath);
}

async function removeDocumentPreview(storedFileName) {
  if (!storedFileName) {
    return;
  }

  try {
    await fs.promises.unlink(getPreviewFilePath(storedFileName));
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Failed to remove document preview: ${error.message}`);
    }
  }
}

module.exports = {
  getOrCreateDocumentPreview,
  removeDocumentPreview,
};
