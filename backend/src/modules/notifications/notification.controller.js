const notificationService = require("./notification.service");

const getNotifications = (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required.",
    });
  }

  const notifications = notificationService.getNotifications(email);

  res.status(200).json({
    success: true,
    data: notifications,
  });
};

module.exports = {
  getNotifications,
};