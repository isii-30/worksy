function StatCard({ title, value, subtitle }) {
  return (
    <article className="stat-card">
      <h2>{title}</h2>
      <p className="stat-value">{value}</p>
      <span>{subtitle}</span>
    </article>
  );
}

export default StatCard;