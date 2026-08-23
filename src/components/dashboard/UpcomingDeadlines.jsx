import DeadlineItem from "./DeadlineItem";

function UpcomingDeadlines({ deadlines }) {
  return (
    <section className="upcoming-deadlines">
      <div className="section-heading">
        <h2>Upcoming Deadlines</h2>
        <button>View all</button>
      </div>

      <div className="deadline-list">
        {deadlines.map((deadline) => (
          <DeadlineItem
            key={deadline.id}
            day={deadline.day}
            month={deadline.month}
            title={deadline.title}
            project={deadline.project}
            time={deadline.time}
            priority={deadline.priority}
          />
        ))}
      </div>
    </section>
  );
}

export default UpcomingDeadlines;