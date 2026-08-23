function NotificationTabs({
  activeTab,
  setActiveTab,
  totalCount,
  unreadCount,
}) {
  return (
    <div className="notification-tabs">

      <button
        className={`notification-tab ${
          activeTab === "all" ? "active" : ""
        }`}
        onClick={() => setActiveTab("all")}
      >
        <span>All</span>
        <span className="tab-count blue-count">
          {totalCount}
        </span>
      </button>

      <button
        className={`notification-tab ${
          activeTab === "unread" ? "active" : ""
        }`}
        onClick={() => setActiveTab("unread")}
      >
        <span>Unread</span>
        <span className="tab-count gray-count">
          {unreadCount}
        </span>
      </button>

    </div>
  );
}

export default NotificationTabs;