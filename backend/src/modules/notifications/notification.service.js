const Notification = require("./notification.model");

const getNotifications = async () => {
  const notifications = await Notification.find()
    .sort({ createdAt: -1 });

  return notifications;
};

const markAsRead = async (notificationId) => {
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );

  return notification;
};

module.exports = {
  getNotifications,
  markAsRead,
};