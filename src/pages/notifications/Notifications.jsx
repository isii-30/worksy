import { useEffect, useState } from "react";

import { getNotifications } from "../../services/notificationService";

import NotificationItem from "../../components/notifications/NotificationItem";
import NotificationTabs from "../../components/notifications/NotificationTabs";


import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await getNotifications();
      setNotifications(data);
    };

    loadNotifications();
  }, []);

  const displayedNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter(
          (notification) => !notification.read
        );

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (notificationId) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  return (
    <div className="notifications-layout">

      {/* Main Notifications area */}
      <main className="notifications-main">

        <div className="notifications-page">

          <div className="notifications-header">
            <h1>Notifications</h1>

            <p>
              Stay updated with everything happening in your workspaces
            </p>
          </div>

          <NotificationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            totalCount={notifications.length}
            unreadCount={unreadCount}
          />

          <div className="notifications-list">
            {displayedNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
              />
            ))}
          </div>

        </div>

      </main>

    </div>
  );
}

export default Notifications;