import OverviewChart from "./OverviewChart";

function OverviewCard({data}) {
  return (
    <section className="overview-card">
      <div className="section-heading">
        <h2>Overview</h2>

        <select>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      <OverviewChart data={data} />
    </section>
  );
}

export default OverviewCard;