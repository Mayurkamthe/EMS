import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const FacultyHome = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => { eventsAPI.getAll().then(r => setEvents(r.data)); }, []);

  const stats = {
    total: events.length,
    pending: events.filter(e => e.status === 'pending').length,
    approved: events.filter(e => e.status === 'approved').length,
    rejected: events.filter(e => e.status === 'rejected').length,
  };

  return (
    <div className="page">
      <h1 className="page-title">👋 Welcome, {user?.name}</h1>

      <div className="stat-grid">
        <div className="stat-card blue"><div className="stat-number">{stats.total}</div><div className="stat-label">Total Events</div></div>
        <div className="stat-card orange"><div className="stat-number">{stats.pending}</div><div className="stat-label">Pending</div></div>
        <div className="stat-card green"><div className="stat-number">{stats.approved}</div><div className="stat-label">Approved</div></div>
        <div className="stat-card purple"><div className="stat-number">{stats.rejected}</div><div className="stat-label">Rejected</div></div>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <Link to="/faculty/create" className="btn btn-primary" style={{ fontSize: '1rem', padding: '14px 28px' }}>
          ➕ Create New Event
        </Link>
        <Link to="/faculty/events" className="btn btn-outline" style={{ fontSize: '1rem', padding: '14px 28px' }}>
          📅 View My Events
        </Link>
      </div>

      {events.filter(e => e.status === 'pending').length > 0 && (
        <div className="card" style={{ marginTop: 24, borderLeft: '4px solid #e65100' }}>
          <h3 style={{ color: '#e65100', marginBottom: 12 }}>⏳ Awaiting Admin Approval</h3>
          {events.filter(e => e.status === 'pending').map(e => (
            <div key={e.id} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
              <span>{e.title}</span>
              <small style={{ color: '#999' }}>{new Date(e.date).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyHome;
