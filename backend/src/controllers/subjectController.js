const mongoose = require("mongoose");

const Subject = require("../models/Subject");

const subjectFields = ["name", "code", "teacher", "credits", "description"];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSubjectPayload(body) {
  return subjectFields.reduce((payload, field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }

    return payload;
  }, {});
}

function isBlank(value) {
  return typeof value !== "string" || value.trim() === "";
}

function isBlankNumber(value) {
  return value === undefined || value === null || (typeof value === "string" && value.trim() === "");
}

function validateRequiredSubjectFields({ name, code, credits }) {
  if (isBlank(name) || isBlank(code) || isBlankNumber(credits)) {
    return "Name, code and credits are required";
  }

  if (Number.isNaN(Number(credits)) || Number(credits) < 0) {
    return "Credits must be a valid number";
  }

  return null;
}

async function findSubjectById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      status: 400,
      message: "Invalid subject id",
    };
  }

  const subject = await Subject.findById(id);

  if (!subject) {
    return {
      status: 404,
      message: "Subject not found",
    };
  }

  return {
    subject,
  };
}

function canAccessSubject(subject, userId) {
  return subject.user.toString() === userId.toString();
}

async function getSubjects(req, res) {
  try {
    const { search } = req.query;
    const searchValue = typeof search === "string" ? search.trim() : "";
    const query = {
      user: req.user._id,
    };

    if (searchValue !== "") {
      const keyword = escapeRegex(searchValue);

      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { code: { $regex: keyword, $options: "i" } },
      ];
    }

    const subjects = await Subject.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get subjects",
    });
  }
}

async function getSubjectById(req, res) {
  try {
    const result = await findSubjectById(req.params.id);

    if (result.status) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    if (!canAccessSubject(result.subject, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this subject",
      });
    }

    return res.json({
      success: true,
      data: result.subject,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get subject",
    });
  }
}

async function createSubject(req, res) {
  try {
    const validationError = validateRequiredSubjectFields(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const payload = buildSubjectPayload(req.body);
    payload.user = req.user._id;
    payload.credits = Number(payload.credits);

    const subject = await Subject.create(payload);

    return res.status(201).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create subject",
    });
  }
}

async function updateSubject(req, res) {
  try {
    const result = await findSubjectById(req.params.id);

    if (result.status) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    if (!canAccessSubject(result.subject, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this subject",
      });
    }

    const payload = buildSubjectPayload(req.body);

    if (payload.credits !== undefined) {
      if (isBlankNumber(payload.credits) || Number.isNaN(Number(payload.credits)) || Number(payload.credits) < 0) {
        return res.status(400).json({
          success: false,
          message: "Credits must be a valid number",
        });
      }

      payload.credits = Number(payload.credits);
    }

    if (payload.name !== undefined && isBlank(payload.name)) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
    }

    if (payload.code !== undefined && isBlank(payload.code)) {
      return res.status(400).json({
        success: false,
        message: "Code cannot be empty",
      });
    }

    const subject = await Subject.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    return res.json({
      success: true,
      data: subject,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update subject",
    });
  }
}

async function deleteSubject(req, res) {
  try {
    const result = await findSubjectById(req.params.id);

    if (result.status) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    if (!canAccessSubject(result.subject, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this subject",
      });
    }

    await result.subject.deleteOne();

    return res.json({
      success: true,
      data: result.subject,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete subject",
    });
  }
}

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};
