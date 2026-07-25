const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      trim: true,
      default: "",
    },
    fileType: {
      type: String,
      trim: true,
      default: "",
    },
    storedFileName: {
      type: String,
      default: "",
      select: false,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

documentSchema.set("toJSON", {
  transform(document, returnedDocument) {
    delete returnedDocument.storedFileName;
    return returnedDocument;
  },
});

module.exports = mongoose.model("Document", documentSchema);
