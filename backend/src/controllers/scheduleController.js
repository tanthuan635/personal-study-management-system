const mongoose = require("mongoose");

const Schedule = require("../models/Schedule");
const Subject = require("../models/Subject");

const SCHEDULE_DAYS = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
];
const SCHEDULE_FIELDS = [
  "subject",
  "dayOfWeek",
  "startTime",
  "endTime",
  "room",
  "note",
];

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function isBlank(value) {
  return typeof value !== "string" || value.trim() === "";
}

function isValidDayOfWeek(dayOfWeek) {
  return SCHEDULE_DAYS.includes(dayOfWeek);
}

function buildSchedulePayload(body = {}) {
  return SCHEDULE_FIELDS.reduce((payload, field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }

    return payload;
  }, {});
}

function compareSchedules(firstSchedule, secondSchedule) {
  const firstDayIndex = SCHEDULE_DAYS.indexOf(firstSchedule.dayOfWeek);
  const secondDayIndex = SCHEDULE_DAYS.indexOf(secondSchedule.dayOfWeek);
  const normalizedFirstDay = firstDayIndex === -1 ? SCHEDULE_DAYS.length : firstDayIndex;
  const normalizedSecondDay = secondDayIndex === -1 ? SCHEDULE_DAYS.length : secondDayIndex;

  if (normalizedFirstDay !== normalizedSecondDay) {
    return normalizedFirstDay - normalizedSecondDay;
  }

  return firstSchedule.startTime.localeCompare(secondSchedule.startTime, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

async function findOwnedSchedule(id, userId) {
  if (!isValidObjectId(id)) {
    return {
      status: 400,
      message: "Invalid schedule id",
    };
  }

  const schedule = await Schedule.findById(id);

  if (!schedule) {
    return {
      status: 404,
      message: "Schedule not found",
    };
  }

  if (schedule.user.toString() !== userId.toString()) {
    return {
      status: 403,
      message: "You do not have permission to access this schedule",
    };
  }

  return { schedule };
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

async function getSchedules(req, res) {
  try {
    const { subject, dayOfWeek } = req.query;
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

    if (dayOfWeek) {
      if (!isValidDayOfWeek(dayOfWeek)) {
        return res.status(400).json({
          success: false,
          message: "Invalid dayOfWeek",
        });
      }

      query.dayOfWeek = dayOfWeek;
    }

    const schedules = await Schedule.find(query);
    schedules.sort(compareSchedules);

    return res.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get schedules",
    });
  }
}

async function getScheduleById(req, res) {
  try {
    const result = await findOwnedSchedule(req.params.id, req.user._id);

    if (result.status) {
      return sendLookupError(res, result);
    }

    return res.json({
      success: true,
      data: result.schedule,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get schedule",
    });
  }
}

async function createSchedule(req, res) {
  try {
    const payload = buildSchedulePayload(req.body);

    if (
      isBlank(payload.dayOfWeek) ||
      isBlank(payload.startTime) ||
      isBlank(payload.endTime)
    ) {
      return res.status(400).json({
        success: false,
        message: "dayOfWeek, startTime and endTime are required",
      });
    }

    if (!isValidDayOfWeek(payload.dayOfWeek)) {
      return res.status(400).json({
        success: false,
        message: "Invalid dayOfWeek",
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

    const schedule = await Schedule.create(payload);

    return res.status(201).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create schedule",
    });
  }
}

async function updateSchedule(req, res) {
  try {
    const result = await findOwnedSchedule(req.params.id, req.user._id);

    if (result.status) {
      return sendLookupError(res, result);
    }

    const payload = buildSchedulePayload(req.body);

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No schedule fields provided",
      });
    }

    if (payload.dayOfWeek !== undefined) {
      if (isBlank(payload.dayOfWeek) || !isValidDayOfWeek(payload.dayOfWeek)) {
        return res.status(400).json({
          success: false,
          message: "Invalid dayOfWeek",
        });
      }
    }

    if (payload.startTime !== undefined && isBlank(payload.startTime)) {
      return res.status(400).json({
        success: false,
        message: "startTime cannot be empty",
      });
    }

    if (payload.endTime !== undefined && isBlank(payload.endTime)) {
      return res.status(400).json({
        success: false,
        message: "endTime cannot be empty",
      });
    }

    const subjectResult = await validateOwnedSubject(payload.subject, req.user._id);

    if (subjectResult.status) {
      return sendLookupError(res, subjectResult);
    }

    if (subjectResult.subject !== undefined) {
      payload.subject = subjectResult.subject;
    }

    result.schedule.set(payload);
    await result.schedule.save();

    return res.json({
      success: true,
      data: result.schedule,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update schedule",
    });
  }
}

async function deleteSchedule(req, res) {
  try {
    const result = await findOwnedSchedule(req.params.id, req.user._id);

    if (result.status) {
      return sendLookupError(res, result);
    }

    await result.schedule.deleteOne();

    return res.json({
      success: true,
      data: result.schedule,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete schedule",
    });
  }
}

module.exports = {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
