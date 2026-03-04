import React, { useEffect, useState } from 'react';
import { eventsAPI } from '../../utils/api';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionEvent, setActionEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [msg, setMsg] = useState('');

  const fetchEvents = () => {
    eventsAPI.getAll().then(r => { setEvents(r.data); setLoading(false); });
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await eventsAPI.updateStatus(id, { status, rejection_reason: rejectionReason });
      setMsg(`Event ${status} successfully`);
      setActionEvent(null);
      setRejectionReason('');
      fetchEvents();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const filtered = events.filter(e => {
    const matchFilter = filter === 'all' || e.status === filter;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.creator_name?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="page">
      <h1 className="page-title">📅 Manage Events</h1>
      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="search-bar">
        <input placeholder="🔍 Search events..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Created By</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#999' }}>No events found</td></tr>
              ) : filtered.map(event => (
                <tr key={event.id}>
                  <td><strong>{event.title}</strong></td>
                  <td>{event.creator_name}</td>
                  <td>{new Date(event.date).toLocaleDateString()}<br /><small>{event.time} - {event.end_time}</small></td>
                  <td>{event.venue || '—'}</td>
                  <td>{event.registered_seats}/{event.total_seats}</td>
                  <td><span className={`badge badge-${event.status}`}>{event.status}</span></td>
                  <td>
                    {event.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-success btn-sm" onClick={() => handleStatus(event.id, 'approved')}>✓ Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setActionEvent(event)}>✗ Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {actionEvent && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h2>Reject Event</h2>
              <button className="close-btn" onClick={() => setActionEvent(null)}>✕</button>
            </div>
            <p style={{ marginBottom: 12, color: '#666' }}>
              Rejecting: <strong>{actionEvent.title}</strong>
            </p>
            <div className="form-group">
              <label>Reason for rejection</label>
              <textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder="Enter rejection reason..." />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-danger" onClick={() => handleStatus(actionEvent.id, 'rejected')}>Reject</button>
              <button className="btn btn-secondary" onClick={() => setActionEvent(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
