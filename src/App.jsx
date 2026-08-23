// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

import Welcome from './pages/auth/Welcome';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

import EditProfile from './pages/profile/EditProfile';

import DashboardPage from './pages/dashboard/DashboardPage';
import Workspace from './pages/workspace/Workspace';
import BoardList from './pages/board/BoardList';
import KanbanBoard from './pages/tasks/KanbanBoard';
import Notifications from './pages/notifications/Notifications';
import Calendar from './pages/calendar/Calendar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/boards" element={<BoardList />} />
          <Route path="/boards/:boardId" element={<KanbanBoard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/calendar" element={<Calendar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;