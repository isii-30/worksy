import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import * as authService from '../../services/authService';
import './AppLayout.css';

export default function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // even if the network call fails, still send them to login
    }
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <Sidebar onLogout={handleLogout} />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}