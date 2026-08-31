const dashboardService = require("./dashboard.service");

const getDashboard = (req, res) => {
  try {
    const dashboardData = dashboardService.getDashboardData();

    return res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard data",
    });
  }
};

module.exports = {
  getDashboard,
};