const WorkspaceMember = require("../membership/member.model");
const BoardMember = require("../board/boardMember.model");
const Task = require("../task/task.model");

const getDashboardData = async (userId) => {
  // -----------------------------------
  // 1. Get user's workspaces
  // -----------------------------------

  const workspaceIds = await WorkspaceMember.distinct("workspace", {
    user: userId,
  });

  const workspaceCount = workspaceIds.length;

  // -----------------------------------
  // 2. Get user's boards
  // -----------------------------------

  const boardIds = await BoardMember.distinct("board", {
    user: userId,
  });

  const boardCount = boardIds.length;

  // -----------------------------------
  // 3. Task statistics
  // -----------------------------------

  const inProgressTaskCount = await Task.countDocuments({
    board: { $in: boardIds },
    completed: false,
  });

  const completedTaskCount = await Task.countDocuments({
    board: { $in: boardIds },
    completed: true,
  });

  // -----------------------------------
  // 4. Upcoming deadlines
  // -----------------------------------

  const now = new Date();

  const upcomingTasks = await Task.find({
    board: { $in: boardIds },
    dueDate: { $gte: now },
  })
    .sort({ dueDate: 1 })
    .limit(4)
    .populate("board", "name")
    .lean();

  const upcomingDeadlines = upcomingTasks.map((task) => {
    const dueDate = new Date(task.dueDate);

    return {
      id: task._id.toString(),

      day: dueDate
        .getDate()
        .toString()
        .padStart(2, "0"),

      month: dueDate
        .toLocaleString("en-US", {
          month: "short",
        })
        .toUpperCase(),

      title: task.title,

      project: task.board?.name || "Unknown Board",

      time: dueDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  });

  // -----------------------------------
  // 5. Overview - last 7 days
  // -----------------------------------

  const overviewData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const createdCount = await Task.countDocuments({
      board: { $in: boardIds },
      createdAt: {
        $gte: date,
        $lt: nextDate,
      },
    });

    overviewData.push({
      day: date.toLocaleString("en-US", {
        weekday: "short",
      }),

      completed: 0,

      created: createdCount,
    });
  }

  // -----------------------------------
  // 6. Return Dashboard response
  // -----------------------------------

  return {
    statistics: [
      {
        id: 1,
        title: "Workspaces",
        value: workspaceCount,
        subtitle: "Total workspaces",
      },

      {
        id: 2,
        title: "Boards",
        value: boardCount,
        subtitle: "Total boards",
      },

      {
        id: 3,
        title: "Tasks",
        value: inProgressTaskCount,
        subtitle: "In progress tasks",
      },

      {
        id: 4,
        title: "Completed",
        value: completedTaskCount,
        subtitle: "Completed tasks",
      },
    ],

    upcomingDeadlines,

    overviewData,
  };
};

module.exports = {
  getDashboardData,
};