const dashboardService = require("./dashboard.service");
const authService = require("../auth/auth.service");

const getDashboard = async (req, res) => {
  try {
    const user = await authService.getCurrentUser();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not logged in.",
      });
    }

    const dashboardData = await dashboardService.getDashboardData(user._id);

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