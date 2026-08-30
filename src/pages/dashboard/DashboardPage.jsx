import { useEffect, useState } from "react";

import StatCard from "../../components/dashboard/StatCard";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import "../../components/dashboard/Dashboard.css";
import OverviewCard from "../../components/dashboard/OverviewCard";
import UpcomingDeadlines from "../../components/dashboard/UpcomingDeadlines";

import ViewProfileModal from "../../components/profile/ViewProfileModal";
import { useProfile } from "../../context/ProfileContext";

function DashboardPage() {
  const { profile } = useProfile();

  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    statistics: [],
    overviewData: [],
    upcomingDeadlines: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:5000/api/dashboard"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await response.json();

        setDashboardData(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="dashboard-page">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <p>Failed to load dashboard: {error}</p>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <DashboardHeader
        onProfileClick={() => setIsViewProfileOpen(true)}
      />

      <div className="dashboard-content-area">
        <section className="stats-grid">
          {dashboardData.statistics.map((stat) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
            />
          ))}
        </section>

        <section className="dashboard-grid">
          <OverviewCard data={dashboardData.overviewData} />

          <UpcomingDeadlines
            deadlines={dashboardData.upcomingDeadlines}
          />
        </section>
      </div>

      {isViewProfileOpen && (
        <ViewProfileModal
          user={{
            ...profile,
            fullName:
              `${profile.firstName} ${profile.lastName}`.trim() ||
              "Your Name",
          }}
          onClose={() => setIsViewProfileOpen(false)}
        />
      )}
    </main>
  );
}

export default DashboardPage;