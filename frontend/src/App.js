import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminEvents from './pages/admin/Events';
import AdminResources from './pages/admin/Resources';
import AdminUsers from './pages/admin/Users';
import AdminReports from './pages/admin/Reports';
import FacultyHome from './pages/faculty/Home';
import FacultyEvents from './pages/faculty/Events';
import CreateEvent from './pages/faculty/CreateEvent';
import ScanQR from './pages/faculty/ScanQR';
import StudentHome from './pages/student/Home';
import StudentEvents from './pages/student/Events';
import MyRegistrations from './pages/student/MyRegistrations';
import './index.css';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to={`/${user.role}`} />;
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={`/${user.role}`} /> : <Register />} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute roles={['admin']}><AdminEvents /></ProtectedRoute>} />
      <Route path="/admin/resources" element={<ProtectedRoute roles={['admin']}><AdminResources /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><AdminReports /></ProtectedRoute>} />

      {/* Faculty & Admin shared tools */}
      <Route path="/faculty/scan" element={<ProtectedRoute roles={['faculty', 'admin']}><ScanQR /></ProtectedRoute>} />

      {/* Faculty */}
      <Route path="/faculty" element={<ProtectedRoute roles={['faculty']}><FacultyHome /></ProtectedRoute>} />
      <Route path="/faculty/events" element={<ProtectedRoute roles={['faculty']}><FacultyEvents /></ProtectedRoute>} />
      <Route path="/faculty/create" element={<ProtectedRoute roles={['faculty']}><CreateEvent /></ProtectedRoute>} />

      {/* Student */}
      <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentHome /></ProtectedRoute>} />
      <Route path="/student/events" element={<ProtectedRoute roles={['student']}><StudentEvents /></ProtectedRoute>} />
      <Route path="/student/registered" element={<ProtectedRoute roles={['student']}><MyRegistrations /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
