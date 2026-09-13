const notificationService = require("./notification.service");

const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getNotifications();

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);

    return res.status(400).json({
      success: false,
      message: "Invalid notification ID.",
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};