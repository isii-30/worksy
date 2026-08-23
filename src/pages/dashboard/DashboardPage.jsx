import { useState } from "react";
import {
  statistics,
  upcomingDeadlines,
  teamActivities,
  overviewData,
} from "../../data/mock/dashboard";
import StatCard from "../../components/dashboard/StatCard";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import "../../components/dashboard/Dashboard.css";
import OverviewCard from "../../components/dashboard/OverviewCard";
import UpcomingDeadlines from "../../components/dashboard/UpcomingDeadlines";
import TeamActivity from "../../components/dashboard/TeamActivity";
import ViewProfileModal from "../../components/profile/ViewProfileModal";
import { useProfile } from "../../context/ProfileContext";

function DashboardPage() {
  const { profile } = useProfile();
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);

  return (
    <main className="dashboard-page">
      <DashboardHeader onProfileClick={() => setIsViewProfileOpen(true)} />

      <div className="dashboard-content-area">
        <section className="stats-grid">
          {statistics.map((stat) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
            />
          ))}
        </section>

        <section className="dashboard-grid">
          <OverviewCard data={overviewData} />
          <UpcomingDeadlines deadlines={upcomingDeadlines} />
          <TeamActivity activities={teamActivities} />
        </section>
      </div>

      {isViewProfileOpen && (
        <ViewProfileModal
          user={{
            ...profile,
            fullName: `${profile.firstName} ${profile.lastName}`.trim() || "Your Name",
          }}
          onClose={() => setIsViewProfileOpen(false)}
        />
      )}
    </main>
  );
}

export default DashboardPage;