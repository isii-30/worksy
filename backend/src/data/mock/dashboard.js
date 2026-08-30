const dashboardData = {
  statistics: [
    {
      id: 1,
      title: "Workspaces",
      value: 3,
      subtitle: "Total workspaces",
    },
    {
      id: 2,
      title: "Boards",
      value: 5,
      subtitle: "Total boards",
    },
    {
      id: 3,
      title: "Tasks",
      value: 34,
      subtitle: "In progress tasks",
    },
    {
      id: 4,
      title: "Completed",
      value: 17,
      subtitle: "Completed tasks",
    },
  ],

  upcomingDeadlines: [
    {
      id: 1,
      day: "22",
      month: "MAY",
      title: "Design Review",
      project: "Project Alpha",
      time: "10:00 AM",
      priority: "High",
    },
    {
      id: 2,
      day: "24",
      month: "MAY",
      title: "Project Kickoff",
      project: "Project Beta",
      time: "2:00 PM",
      priority: "Medium",
    },
    {
      id: 3,
      day: "26",
      month: "MAY",
      title: "Sprint Planning",
      project: "Project Alpha",
      time: "9:30 AM",
      priority: "High",
    },
    {
      id: 4,
      day: "28",
      month: "MAY",
      title: "Client Presentation",
      project: "Project Gamma",
      time: "3:00 PM",
      priority: "Low",
    },
  ],

  overviewData: [
    {
      day: "Mon",
      completed: 15,
      created: 6,
    },
    {
      day: "Tue",
      completed: 20,
      created: 10,
    },
    {
      day: "Wed",
      completed: 28,
      created: 14,
    },
    {
      day: "Thu",
      completed: 16,
      created: 8,
    },
    {
      day: "Fri",
      completed: 24,
      created: 12,
    },
    {
      day: "Sat",
      completed: 18,
      created: 7,
    },
    {
      day: "Sun",
      completed: 22,
      created: 11,
    },
  ],
};

module.exports = dashboardData;