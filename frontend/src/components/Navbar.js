import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ─── Inline SVG Icons ─── */
const Icon = {
  Dashboard: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="7" height="7" rx="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3.5" width="16" height="14" rx="2" />
      <path d="M6 2v3M14 2v3M2 8h16" />
    </svg>
  ),
  Resource: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17V7l7-4 7 4v10" />
      <path d="M8 17v-5h4v5" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="7" r="3" />
      <path d="M1 17c0-3 2.9-5 6.5-5" />
      <circle cx="14" cy="7" r="3" />
      <path d="M10 17c0-3 2.9-5 6-5" />
    </svg>
  ),
  Report: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2h9l3 3v13a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
      <path d="M13 2v4h3M7 9h6M7 12h6M7 15h4" />
    </svg>
  ),
  Home: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l7-6 7 6v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" />
      <path d="M8 19v-7h4v7" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 7v6M7 10h6" />
    </svg>
  ),
  Ticket: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8a2 2 0 000 4V16a1 1 0 001 1h14a1 1 0 001-1v-4a2 2 0 000-4V4a1 1 0 00-1-1H3a1 1 0 00-1 1v4z" />
      <path d="M8 4v12" strokeDasharray="2 2" />
    </svg>
  ),
  ScanQR: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V4h3M17 4h3v3M4 17v3h3M17 20h3v-3" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 3h4a1 1 0 011 1v12a1 1 0 01-1 1h-4" />
      <path d="M9 14l4-4-4-4" />
      <path d="M13 10H3" />
    </svg>
  ),
  Logo: () => (
    <svg viewBox="0 0 24 24" fill="white">
      <path d="M12 2L2 7l10 5 10-5-10-5zm0 7L2 14l10 5 10-5-10-5zm0 7L2 21l10 5 10-5-10-5z" opacity="0.8" />
      <path d="M12 3a3 3 0 100 6 3 3 0 000-6z" opacity="0.6" />
    </svg>
  ),
};

const EmsLogo = () => (
  <svg viewBox="0 0 24 24" fill="white">
    <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" opacity="0.2" fill="white" />
    <path d="M8 8h8M8 12h6M8 16h4" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="17" cy="7" r="3" fill="white" opacity="0.9" />
    <path d="M16 7h2M17 6v2" stroke="#1B3A6B" strokeWidth="1.2" strokeLinecap="round" fill="none" />
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', Icon: Icon.Dashboard },
    { to: '/admin/events', label: 'Events', Icon: Icon.Calendar },
    { to: '/admin/resources', label: 'Resources', Icon: Icon.Resource },
    { to: '/admin/users', label: 'Users', Icon: Icon.Users },
    { to: '/admin/reports', label: 'Reports', Icon: Icon.Report },
    { to: '/faculty/scan', label: 'Scan QR', Icon: Icon.ScanQR },
  ];

  const facultyLinks = [
    { to: '/faculty', label: 'Home', Icon: Icon.Home },
    { to: '/faculty/events', label: 'My Events', Icon: Icon.Calendar },
    { to: '/faculty/create', label: 'Create Event', Icon: Icon.Plus },
    { to: '/faculty/scan', label: 'Scan QR', Icon: Icon.ScanQR },
  ];

  const studentLinks = [
    { to: '/student', label: 'Home', Icon: Icon.Home },
    { to: '/student/events', label: 'Events', Icon: Icon.Calendar },
    { to: '/student/registered', label: 'My Tickets', Icon: Icon.Ticket },
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'faculty' ? facultyLinks : studentLinks;

  if (!user) return null;

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

  return (
    <>
      <div className="top-app-bar">
        <div className="top-app-bar-inner">
          {/* Brand */}
          <div className="navbar-brand">
            <div className="navbar-brand-logo">
              <EmsLogo />
            </div>
            <span className="navbar-brand-name">EMS</span>
          </div>

          {/* Desktop Nav Links */}
          <ul className="desktop-nav">
            {links.map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to.split('/').length <= 2}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  <link.Icon />
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right section */}
          <div className="navbar-right">
            <div className="user-profile-header">
              <div className="avatar">{initials}</div>
              <div className="greeting">
                <span className="greeting-text">Welcome back</span>
                <span className="greeting-name">
                  {user.name}
                </span>
              </div>
              <span className={`role-chip ${user.role}`}>{user.role}</span>
            </div>

            <button className="action-icon" onClick={handleLogout} title="Sign out">
              <Icon.Logout />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="bottom-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to.split('/').length <= 2}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="icon"><link.Icon /></span>
            <span>{link.label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Navbar;
