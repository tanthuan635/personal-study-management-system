const mongoose = require("mongoose");
const path = require("path");

const Document = require("../models/Document");
const Subject = require("../models/Subject");
const { removeUploadedFile } = require("../middleware/uploadMiddleware");
const {
  getOrCreateDocumentPreview,
  removeDocumentPreview,
} = require("../utils/documentPreview");

const DOCUMENT_FIELDS = [
  "title",
  "subject",
  "fileName",
  "fileUrl",
  "fileType",
  "description",
];

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function isBlank(value) {
  return typeof value !== "string" || value.trim() === "";
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildDocumentPayload(body = {}) {
  return DOCUMENT_FIELDS.reduce((payload, field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }

    return payload;
  }, {});
}

async function findOwnedDocument(id, userId) {
  if (!isValidObjectId(id)) {
    return {
      status: 400,
      message: "Invalid document id",
    };
  }

  const document = await Document.findById(id).select("+storedFileName");

  if (!document) {
    return {
      status: 404,
      message: "Document not found",
    };
  }

  if (document.user.toString() !== userId.toString()) {
    return {
      status: 403,
      message: "You do not have permission to access this document",
    };
  }

  return { document };
}

async function validateOwnedSubject(subjectId, userId) {
  if (subjectId === undefined) {
    return {};
  }

  if (subjectId === null || subjectId === "") {
    return { subject: null };
  }

  if (!isValidObjectId(subjectId)) {
    return {
      status: 400,
      message: "Invalid subject id",
    };
  }

  const subjectExists = await Subject.exists({
    _id: subjectId,
    user: userId,
  });

  if (!subjectExists) {
    return {
      status: 404,
      message: "Subject not found",
    };
  }

  return { subject: subjectId };
}

function sendLookupError(res, result) {
  return res.status(result.status).json({
    success: false,
    message: result.message,
  });
}

function applyUploadedFile(payload, file) {
  if (!file) {
    return;
  }

  payload.fileName = file.originalname;
  payload.fileUrl = `/uploads/${file.filename}`;
  payload.fileType = path.extname(file.originalname).slice(1).toUpperCase();
  payload.storedFileName = file.filename;
}

async function getDocuments(req, res) {
  try {
    const { subject, search } = req.query;
    const searchValue = typeof search === "string" ? search.trim() : "";
    const query = {
      user: req.user._id,
    };

    if (subject) {
      if (!isValidObjectId(subject)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subject id",
        });
      }

      query.subject = subject;
    }

    if (searchValue !== "") {
      const keyword = escapeRegex(searchValue);

      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { fileName: { $regex: keyword, $options: "i" } },
      ];
    }

    const documents = await Document.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get documents",
    });
  }
}

async function getDocumentById(req, res) {
  try {
    const result = await findOwnedDocument(req.params.id, req.user._id);

    if (result.status) {
      return sendLookupError(res, result);
    }

    return res.json({
      success: true,
      data: result.document,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get document",
    });
  }
}

async function getDocumentPreview(req, res) {
  try {
    const result = await findOwnedDocument(req.params.id, req.user._id);

    if (result.status) {
      return sendLookupError(res, result);
    }

    const previewPath = await getOrCreateDocumentPreview(
      result.document.storedFileName,
    );

    res.type("application/pdf");
    res.setHeader("Content-Disposition", "inline");
    return res.sendFile(previewPath);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode
          ? error.message
          : "Không thể tạo bản xem trước cho tài liệu Office.",
    });
  }
}

async function createDocument(req, res) {
  try {
    const payload = buildDocumentPayload(req.body);
    applyUploadedFile(payload, req.file);

    if (isBlank(payload.title) || isBlank(payload.fileName)) {
      await removeUploadedFile(req.file?.filename);

      return res.status(400).json({
        success: false,
        message: "Title and fileName are required",
      });
    }

    const subjectResult = await validateOwnedSubject(payload.subject, req.user._id);

    if (subjectResult.status) {
      await removeUploadedFile(req.file?.filename);
      return sendLookupError(res, subjectResult);
    }

    if (subjectResult.subject === null) {
      delete payload.subject;
    } else if (subjectResult.subject !== undefined) {
      payload.subject = subjectResult.subject;
    }

    payload.user = req.user._id;

    const document = await Document.create(payload);

    return res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    await removeUploadedFile(req.file?.filename);

    return res.status(500).json({
      success: false,
      message: "Failed to create document",
    });
  }
}

async function updateDocument(req, res) {
  try {
    const result = await findOwnedDocument(req.params.id, req.user._id);

    if (result.status) {
      return sendLookupError(res, result);
    }

    const payload = buildDocumentPayload(req.body);

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No document fields provided",
      });
    }

    if (payload.title !== undefined && isBlank(payload.title)) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }

    if (payload.fileName !== undefined && isBlank(payload.fileName)) {
      return res.status(400).json({
        success: false,
        message: "fileName cannot be empty",
      });
    }

    const subjectResult = await validateOwnedSubject(payload.subject, req.user._id);

    if (subjectResult.status) {
      return sendLookupError(res, subjectResult);
    }

    if (subjectResult.subject !== undefined) {
      payload.subject = subjectResult.subject;
    }

    result.document.set(payload);
    await result.document.save();

    return res.json({
      success: true,
      data: result.document,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update document",
    });
  }
}

async function deleteDocument(req, res) {
  try {
    const result = await findOwnedDocument(req.params.id, req.user._id);

    if (result.status) {
      return sendLookupError(res, result);
    }

    await result.document.deleteOne();
    await Promise.all([
      removeUploadedFile(result.document.storedFileName),
      removeDocumentPreview(result.document.storedFileName),
    ]);

    return res.json({
      success: true,
      data: result.document,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete document",
    });
  }
}

module.exports = {
  getDocuments,
  getDocumentById,
  getDocumentPreview,
  createDocument,
  updateDocument,
  deleteDocument,
};
