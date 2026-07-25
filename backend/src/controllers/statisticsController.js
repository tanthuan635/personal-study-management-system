const Subject = require("../models/Subject");
const Task = require("../models/Task");

const COMPLETED_STATUS = "Hoàn thành";

function getStatisticsDateRange(referenceDate = new Date()) {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const upcomingEnd = new Date(today);
  upcomingEnd.setDate(upcomingEnd.getDate() + 7);

  return {
    today,
    upcomingEnd,
  };
}

async function getOverview(req, res) {
  try {
    const user = req.user._id;
    const { today, upcomingEnd } = getStatisticsDateRange();
    const incompleteTaskQuery = {
      user,
      status: { $ne: COMPLETED_STATUS },
    };

    const [totalSubjects, totalTasks, completedTasks, overdueTasks, upcomingTasks] =
      await Promise.all([
        Subject.countDocuments({ user }),
        Task.countDocuments({ user }),
        Task.countDocuments({ user, status: COMPLETED_STATUS }),
        Task.countDocuments({
          ...incompleteTaskQuery,
          dueDate: { $lt: today },
        }),
        Task.countDocuments({
          ...incompleteTaskQuery,
          dueDate: {
            $gte: today,
            $lt: upcomingEnd,
          },
        }),
      ]);

    const pendingTasks = totalTasks - completedTasks;
    const completionRate =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return res.json({
      success: true,
      data: {
        totalSubjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate,
        overdueTasks,
        upcomingTasks,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get statistics overview",
    });
  }
}

module.exports = {
  getOverview,
};
