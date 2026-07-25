const express = require("express");

const {
  createDocument,
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} = require("../controllers/documentController");
const { protect } = require("../middleware/authMiddleware");
const { uploadDocumentFile } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getDocuments).post(uploadDocumentFile, createDocument);
router.route("/:id").get(getDocumentById).put(updateDocument).delete(deleteDocument);

module.exports = router;
