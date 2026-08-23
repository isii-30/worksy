import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AppLayout.css';

export default function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: call auth logout service (src/services) once backend exists —
    // clear the session/token there before navigating away.
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