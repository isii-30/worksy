function ActivityItem({
  user,
  action,
  target,
  description,
  time,
}) {
  return (
    <article className="activity-item">
      <div className="activity-avatar">
        {user.charAt(0)}
      </div>

      <div className="activity-content">
        <p>
          <strong>{user}</strong>{" "}
          {action} <strong>{target}</strong>
        </p>

        <span>{description}</span>
      </div>

      <time>{time}</time>
    </article>
  );
}

export default ActivityItem;