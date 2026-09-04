const dashboardService = require("./dashboard.service");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const dashboardData =
      await dashboardService.getDashboardData(userId);

    return res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard data",
    });
  }
};

module.exports = {
  getDashboard,
};