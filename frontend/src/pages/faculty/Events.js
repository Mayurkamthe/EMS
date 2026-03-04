import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../../utils/api';

const FacultyEvents = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => { eventsAPI.getAll().then(r => setEvents(r.data)); }, []);

  const filtered = filter === 'all' ? events : events.filter(e => e.status === filter);

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>📅 My Events</h1>
        <Link to="/faculty/create" className="btn btn-primary">➕ Create Event</Link>
      </div>

      <div className="search-bar">
        {['all', 'pending', 'approved', 'rejected'].map(s => (
          <button key={s} className={`btn ${filter === s ? 'btn-primary' : 'btn-outline'} btn-sm`} onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
          <p style={{ color: '#999' }}>No events found. <Link to="/faculty/create">Create your first event</Link></p>
        </div>
      ) : (
        <div className="events-grid">
          {filtered.map(event => (
            <div key={event.id} className="event-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className={`badge badge-${event.status}`}>{event.status}</span>
                <small style={{ color: '#999' }}>{new Date(event.date).toLocaleDateString()}</small>
              </div>
              <h3>{event.title}</h3>
              <div className="event-meta">
                <span>🕒 {event.time} - {event.end_time}</span>
                {event.venue && <span>📍 {event.venue}</span>}
                <span>👥 {event.registered_seats}/{event.total_seats} registered</span>
              </div>
              {event.status === 'rejected' && event.rejection_reason && (
                <div className="alert alert-error" style={{ fontSize: '0.8rem', padding: '8px 12px' }}>
                  ❌ {event.rejection_reason}
                </div>
              )}
              <div className="seats-bar">
                <div className="seats-bar-track">
                  <div
                    className={`seats-bar-fill ${event.registered_seats / event.total_seats > 0.8 ? 'danger' : event.registered_seats / event.total_seats > 0.6 ? 'warning' : ''}`}
                    style={{ width: `${(event.registered_seats / event.total_seats) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyEvents;
