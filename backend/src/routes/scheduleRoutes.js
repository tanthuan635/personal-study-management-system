const express = require("express");

const {
  createSchedule,
  deleteSchedule,
  getScheduleById,
  getSchedules,
  updateSchedule,
} = require("../controllers/scheduleController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getSchedules).post(createSchedule);
router.route("/:id").get(getScheduleById).put(updateSchedule).delete(deleteSchedule);

module.exports = router;
