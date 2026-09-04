const getModels = () => {
  /*
   * ASSUMED MODEL PATHS
   *
   * Change these require paths if your teammates
   * use different filenames.
   */

  const WorkspaceMember = require("../membership/workspaceMember.model");
  const BoardMember = require("../board/boardMember.model");
  const Task = require("../task/task.model");
  const Column = require("../column/column.model");

  return {
    WorkspaceMember,
    BoardMember,
    Task,
    Column,
  };
};

const getDashboardData = async (userId) => {
  const {
    WorkspaceMember,
    BoardMember,
    Task,
    Column,
  } = getModels();

  // --------------------------------------------------
  // 1. Count workspaces for the current user
  // --------------------------------------------------

  const workspaceCount = await WorkspaceMember.countDocuments({
    user: userId,
  });

  // --------------------------------------------------
  // 2. Find boards available to the current user
  // --------------------------------------------------

  const boardMemberships = await BoardMember.find({
    user: userId,
  }).select("board");

  const boardIds = boardMemberships.map(
    (membership) => membership.board
  );

  const boardCount = boardIds.length;

  // --------------------------------------------------
  // 3. Find tasks belonging to the user's boards
  // --------------------------------------------------

  const tasks = await Task.find({
    board: { $in: boardIds },
  });

  const taskCount = tasks.length;

  // --------------------------------------------------
  // 4. Find completed tasks
  //
  // IMPORTANT:
  // Task does NOT have a status field.
  // Status comes from Column.
  //
  // We are temporarily assuming that a completed
  // column is represented by isTodoColumn: false.
  //
  // THIS IS AN ASSUMPTION and may need to change.
  // --------------------------------------------------

  const columns = await Column.find({
    board: { $in: boardIds },
  });

  const completedColumnIds = columns
    .filter((column) => column.isTodoColumn === false)
    .map((column) => column._id);

  const completedTaskCount = await Task.countDocuments({
    board: { $in: boardIds },
    column: { $in: completedColumnIds },
  });

  // --------------------------------------------------
  // 5. Upcoming deadlines
  // --------------------------------------------------

  const now = new Date();

  const upcomingTasks = await Task.find({
    board: { $in: boardIds },
    dueDate: {
      $gte: now,
    },
  })
    .sort({ dueDate: 1 })
    .limit(4)
    .populate("board", "name");

  const upcomingDeadlines = upcomingTasks.map((task) => {
    const dueDate = new Date(task.dueDate);

    return {
      id: task._id,
      day: dueDate.getDate().toString().padStart(2, "0"),
      month: dueDate
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase(),
      title: task.title,
      project: task.board?.name || "Unknown Board",
      time: dueDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  });

  // --------------------------------------------------
  // 6. Overview
  //
  // We can calculate CREATED tasks from createdAt.
  //
  // Historical COMPLETED tasks cannot currently be
  // calculated accurately because Task has no
  // completedAt field.
  //
  // Therefore we temporarily return zero for completed.
  // We can improve this later using ActivityLog if
  // completion events are recorded there.
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Return the same structure expected by the frontend
  // --------------------------------------------------

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
        value: taskCount,
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