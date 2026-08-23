function DeadlineItem({
  day,
  month,
  title,
  project,
  time,
  priority,
}) {
  return (
    <article className="deadline-item">
      <div className="deadline-date">
        <strong>{day}</strong>
        <span>{month}</span>
      </div>

      <div className="deadline-info">
        <h3>{title}</h3>
        <p>{project}</p>
      </div>

      <div className="deadline-meta">
        <span>{time}</span>
        <span className={`priority priority-${priority.toLowerCase()}`}>
          {priority}
        </span>
      </div>
    </article>
  );
}

export default DeadlineItem;