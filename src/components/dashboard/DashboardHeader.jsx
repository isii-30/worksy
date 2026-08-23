import { UserRound } from "lucide-react";

function DashboardHeader({ onProfileClick }) {
  return (
    <header className="dashboard-header">
      <div>
        <h1>Dashboard</h1>
        <p>Overview of your workspace activity and progress</p>
      </div>

      <button
        type="button"
        className="profile-icon"
        onClick={onProfileClick}
        aria-label="View profile"
      >
        <UserRound size={20} />
      </button>
    </header>
  );
}

export default DashboardHeader;