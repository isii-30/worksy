function NotificationItem({
  notification,
  onMarkAsRead,
}) {
  const isInvitation =
    notification.type === "workspace_invitation";

  const handleClick = () => {
    onMarkAsRead(notification.id);
  };

  return (
    <div
      className={`notification-item ${
        notification.read ? "read" : "unread"
      }`}
      onClick={handleClick}
    >
      <div className={`notification-icon ${notification.type}`}>
        <span>
          {notification.type === "workspace_invitation" && "■"}
          {notification.type === "deadline" && "▤"}
          {notification.type === "task_created" && "+"}
          {notification.type === "member_joined" && "✓"}
          {notification.type === "member_removed" && "−"}
        </span>
      </div>

      <div className="notification-content">

        <div className="notification-title-row">
          <h3>{notification.title}</h3>

          {notification.type === "deadline" && (
            <span className="deadline-text">
              {notification.message}
            </span>
          )}
        </div>

        {notification.type !== "deadline" &&
          notification.message && (
            <p className="notification-message">
              {notification.message}
            </p>
          )}

        <small className="notification-time">
          {notification.createdAt}
        </small>

        {isInvitation && (
          <div
            className="notification-actions"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="decline-button">
              Decline
            </button>

            <button className="accept-button">
              Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationItem;