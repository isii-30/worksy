import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function OverviewChart({ data }) {
  return (
    <div className="overview-chart">
      <ResponsiveContainer width="100%" height={280}>
  <LineChart data={data}>
    <CartesianGrid
      strokeDasharray="3 3"
      stroke="var(--dashboard-chart-grid)"
    />

    <XAxis
      dataKey="day"
      axisLine={false}
      tickLine={false}
    />

    <YAxis
      axisLine={false}
      tickLine={false}
    />

    <Tooltip />

    <Line
      type="monotone"
      dataKey="completed"
      stroke="var(--dashboard-primary)"
      strokeWidth={2}
      dot={{ r: 3 }}
    />

    <Line
      type="monotone"
      dataKey="created"
      stroke="var(--dashboard-chart-secondary)"
      strokeWidth={2}
      dot={{ r: 3 }}
    />
  </LineChart>
</ResponsiveContainer>
    </div>
  );
}

export default OverviewChart;