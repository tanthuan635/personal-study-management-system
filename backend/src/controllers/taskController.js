const mongoose = require("mongoose");

const Subject = require("../models/Subject");
const Task = require("../models/Task");

const TASK_STATUSES = ["Chưa làm", "Đang làm", "Hoàn thành"];
const TASK_PRIORITIES = ["Thấp", "Trung bình", "Cao"];
const TASK_FIELDS = ["title", "subject", "dueDate", "priority", "status", "note"];

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function isValidStatus(status) {
  return TASK_STATUSES.includes(status);
}

function isValidPriority(priority) {
  return TASK_PRIORITIES.includes(priority);
}

function isBlank(value) {
  return typeof value !== "string" || value.trim() === "";
}

function parseDate(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildTaskPayload(body = {}) {
  return TASK_FIELDS.reduce((payload, field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }

    return payload;
  }, {});
}

async function findOwnedTask(id, userId) {
  if (!isValidObjectId(id)) {
    return {
      status: 400,
      message: "Invalid task id",
    };
  }

  const task = await Task.findById(id);

  if (!task) {
    return {
      status: 404,
      message: "Task not found",
    };
  }

  if (task.user.toString() !== userId.toString()) {
    return {
      status: 403,
      message: "You do not have permission to access this task",
    };
  }

  return { task };
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

async function getTasks(req, res) {
  try {
    const { subject, status, priority } = req.query;
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

    if (status) {
      if (!isValidStatus(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task status",
        });
      }

      query.status = status;
    }

    if (priority) {
      if (!isValidPriority(priority)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task priority",
        });
      }

      query.priority = priority;
    }

    const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: 1 });

    return res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get tasks",
    });
  }
}

async function getTaskById(req, res) {
  try {
    const result = await findOwnedTask(req.params.id, req.user._id);

    if (result.status) {
      return sendLookupError(res, result);
    }

    return res.json({
      success: true,
      data: result.task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get task",
    });
  }
}

async function createTask(req, res) {
  try {
    const payload = buildTaskPayload(req.body);

    if (isBlank(payload.title) || payload.dueDate === undefined) {
      return res.status(400).json({
        success: false,
        message: "Title and dueDate are required",
      });
    }

    const dueDate = parseDate(payload.dueDate);

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid dueDate",
      });
    }

    if (payload.priority !== undefined && !isValidPriority(payload.priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task priority",
      });
    }

    if (payload.status !== undefined && !isValidStatus(payload.status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
    }

    const subjectResult = await validateOwnedSubject(payload.subject, req.user._id);

    if (subjectResult.status) {
      return sendLookupError(res, subjectResult);
    }

    if (subjectResult.subject === null) {
      delete payload.subject;
    } else if (subjectResult.subject !== undefined) {
      payload.subject = subjectResult.subject;
    }

    payload.user = req.user._id;
    payload.dueDate = dueDate;

    const task = await Task.create(payload);

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
}

async function updateTask(req, res) {
  try {
    const result = await findOwnedTask(req.params.id, req.user._id);

    if (result.status) {
      return sendLookupError(res, result);
    }

    const payload = buildTaskPayload(req.body);

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No task fields provided",
      });
    }

    if (payload.title !== undefined && isBlank(payload.title)) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }

    if (payload.dueDate !== undefined) {
      const dueDate = parseDate(payload.dueDate);

      if (!dueDate) {
        return res.status(400).json({
          success: false,
          message: "Invalid dueDate",
        });
      }

      payload.dueDate = dueDate;
    }

    if (payload.priority !== undefined && !isValidPriority(payload.priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task priority",
      });
    }

    if (payload.status !== undefined && !isValidStatus(payload.status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
    }

    const subjectResult = await validateOwnedSubject(payload.subject, req.user._id);

    if (subjectResult.status) {
      return sendLookupError(res, subjectResult);
    }

    if (subjectResult.subject !== undefined) {
      payload.subject = subjectResult.subject;
    }

    result.task.set(payload);
    await result.task.save();

    return res.json({
      success: true,
      data: result.task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
}

async function updateTaskStatus(req, res) {
  try {
    const { status } = req.body || {};

    if (!isValidStatus(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
    }

    const result = await findOwnedTask(req.params.id, req.user._id);

    if (result.status) {
      return sendLookupError(res, result);
    }

    result.task.status = status;
    await result.task.save();

    return res.json({
      success: true,
      data: result.task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update task status",
    });
  }
}

async function deleteTask(req, res) {
  try {
    const result = await findOwnedTask(req.params.id, req.user._id);

    if (result.status) {
      return sendLookupError(res, result);
    }

    await result.task.deleteOne();

    return res.json({
      success: true,
      data: result.task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
