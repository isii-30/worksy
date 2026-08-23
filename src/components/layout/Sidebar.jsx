import { NavLink } from 'react-router-dom';
import worksyLogo from '../../assets/worksy-logo.png';
import {
  LayoutDashboard,
  LayoutGrid,
  Calendar,
  Bell,
  User,
  LogOut,
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: LayoutGrid, label: 'Workspace', to: '/workspace' },
  { icon: Calendar, label: 'Calendar', to: '/calendar' },
  { icon: Bell, label: 'Notification', to: '/notifications' },
  { icon: User, label: 'Profile', to: '/profile' },
];

export default function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={worksyLogo} alt="Worksy" className="sidebar-logo-img" />
        <div className="sidebar-subtitle">Collaborate. Organize. Achieve.</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `sidebar-nav-item${isActive ? ' active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-logout" onClick={onLogout}>
          <LogOut size={18} strokeWidth={2} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}