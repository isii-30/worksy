import ActivityItem from "./ActivityItem";

function TeamActivity({ activities }) {
  return (
    <section className="team-activity">
      <div className="section-heading">
        <h2>Team Activity</h2>
        <button>View all</button>
      </div>

      <div className="activity-list">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            user={activity.user}
            action={activity.action}
            target={activity.target}
            description={activity.description}
            time={activity.time}
          />
        ))}
      </div>
    </section>
  );
}

export default TeamActivity;