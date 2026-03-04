import React, { useEffect, useState } from 'react';
import { eventsAPI } from '../../utils/api';

const Icons = {
  Search: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="6" /><path d="M15 15l3 3" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3.5" width="16" height="14" rx="2" /><path d="M6 2v3M14 2v3M2 8h16" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" /><path d="M10 6v4l3 3" />
    </svg>
  ),
  Pin: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2C7.2 2 5 4.2 5 7c0 4 5 11 5 11s5-7 5-11c0-2.8-2.2-5-5-5z" /><circle cx="10" cy="7" r="1.8" />
    </svg>
  ),
  Heart: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 17S2 11.8 2 6.5A4.5 4.5 0 0110 4a4.5 4.5 0 018 2.5C18 11.8 10 17 10 17z" />
    </svg>
  ),
  Ticket: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8a2 2 0 000 4V16a1 1 0 001 1h14a1 1 0 001-1v-4a2 2 0 000-4V4a1 1 0 00-1-1H3a1 1 0 00-1 1v4z" />
      <path d="M8 4v12" strokeDasharray="2 2" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10l5 5 7-8" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="7" r="3" /><path d="M1 17c0-3 2.9-5 6.5-5" />
      <circle cx="14" cy="7" r="3" /><path d="M10 17c0-3 2.9-5 6-5" />
    </svg>
  ),
};

const EventCard = ({ event, onClick }) => {
  const seatsLeft = event.total_seats - event.registered_seats;
  const isFull = seatsLeft <= 0;

  return (
    <div className="event-card" onClick={onClick}>
      <div className="event-image-placeholder">
        <Icons.Calendar />
        <div className="ticket-price">{event.is_paid ? `₹${event.fee}` : 'Free'}</div>
        <button className="fav-btn" onClick={e => e.stopPropagation()}>
          <Icons.Heart />
        </button>
      </div>
      <div className="event-card-body">
        <h3>{event.title}</h3>
        <div className="event-meta-info">
          <Icons.Calendar />
          {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
        <div className="event-meta-info">
          <Icons.Clock />
          {event.time} – {event.end_time}
        </div>
        {event.venue && (
          <div className="event-meta-info">
            <Icons.Pin />
            {event.venue}
          </div>
        )}
        <div className={`seats-left ${isFull ? 'full' : 'available'}`}>
          {isFull ? 'Event full' : `${seatsLeft} seats available`}
        </div>
      </div>
    </div>
  );
};

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEvents = () => eventsAPI.getAll().then(r => {
    const data = r.data.map(e => ({
      ...e,
      is_paid: e.is_paid === 1 || e.is_paid === true || e.is_paid === '1',
      fee: parseFloat(e.fee) || 0
    }));
    setEvents(data);
  });
  useEffect(() => { fetchEvents(); }, []);

  const handleRegister = async (event) => {
    setLoading(true); setError(''); setMsg('');
    try {
      if (event.is_paid) {
        setMsg('Processing payment...');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Mock payment delay
      }
      await eventsAPI.register(event.id);
      setMsg(event.is_paid ? 'Payment successful! Registered for event.' : 'Registered successfully!');
      fetchEvents();
      setTimeout(() => setSelected(null), 2000); // close modal after success
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    (e.venue && e.venue.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page animated">
      {msg && (
        <div className="alert alert-success">
          <Icons.Check /> {msg}
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <Icons.X /> {error}
        </div>
      )}

      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Browse Events</h1>
          <p className="page-subtitle">Discover and register for upcoming events</p>
        </div>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon"><Icons.Search /></span>
          <input
            type="text"
            placeholder="Search events by name or venue..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <h2 className="section-title">All Events</h2>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><Icons.Calendar /></div>
            <h3>No events found</h3>
            <p>Try a different search term</p>
          </div>
        </div>
      ) : (
        <div className="events-grid">
          {filtered.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => { setSelected(event); setMsg(''); setError(''); }}
            />
          ))}
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selected.title}</h2>
              <button className="close-btn" onClick={() => setSelected(null)}>
                <Icons.X />
              </button>
            </div>

            <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.6, marginBottom: 20 }}>
              {selected.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24, padding: 16, background: 'var(--bg)', borderRadius: 'var(--r-lg)' }}>
              {[
                { label: 'Date', value: new Date(selected.date).toLocaleDateString() },
                { label: 'Time', value: `${selected.time} – ${selected.end_time}` },
                selected.venue && { label: 'Venue', value: selected.venue },
                { label: 'Capacity', value: selected.total_seats },
                { label: 'Type', value: selected.is_paid ? `Paid (₹${selected.fee})` : 'Free' },
                { label: 'Organizer', value: selected.creator_name },
              ].filter(Boolean).map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-heading)' }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>
                <span style={{ color: 'var(--text-muted)' }}>Seats filled</span>
                <span style={{ color: 'var(--text-heading)', fontWeight: 700 }}>
                  {selected.registered_seats} / {selected.total_seats}
                </span>
              </div>
              <div className="seats-bar">
                <div className="seats-bar-track">
                  <div
                    className={`seats-bar-fill ${selected.registered_seats / selected.total_seats > 0.9 ? 'danger' : selected.registered_seats / selected.total_seats > 0.7 ? 'warning' : ''}`}
                    style={{ width: `${Math.min((selected.registered_seats / selected.total_seats) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => handleRegister(selected)}
                disabled={loading || selected.registered_seats >= selected.total_seats}
              >
                <Icons.Ticket />
                {loading
                  ? (msg === 'Processing payment...' ? 'Processing...' : 'Registering...')
                  : selected.registered_seats >= selected.total_seats
                    ? 'Event Full'
                    : selected.is_paid ? `Pay ₹${selected.fee} & Register` : 'Register Now'}
              </button>
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentEvents;
