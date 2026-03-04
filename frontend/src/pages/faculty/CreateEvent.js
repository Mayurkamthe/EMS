import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI, resourcesAPI } from '../../utils/api';

const Icons = {
  Hall: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17V7l7-4 7 4v10" /><path d="M8 17v-5h4v5" />
    </svg>
  ),
  Projector: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="18" height="8" rx="2" /><circle cx="10" cy="10" r="2" /><path d="M7 18h6" />
    </svg>
  ),
  Sound: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h4l5 5V2L7 7H3z" /><path d="M15.5 6.5a5 5 0 010 7" />
    </svg>
  ),
  Box: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2L2 6v8l8 4 8-4V6l-8-4z" /><path d="M2 6l8 4 8-4M10 10v10" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8l4 4 6-6" />
    </svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" /><path d="M10 6v4" /><circle cx="10" cy="14" r="0.8" fill="currentColor" />
    </svg>
  ),
  Success: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" /><path d="M7 10l2.5 2.5L13 8" />
    </svg>
  ),
};

const typeIcon = {
  hall: Icons.Hall,
  projector: Icons.Projector,
  sound_system: Icons.Sound,
  other: Icons.Box,
};

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '', end_time: '',
    venue: '', total_seats: 50, is_paid: false, fee: ''
  });
  const [resources, setResources] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { resourcesAPI.getAll().then(r => setResources(r.data)); }, []);

  const toggleResource = (resource) => {
    setSelectedResources(prev => {
      const exists = prev.find(r => r.resource_id === resource.id);
      if (exists) return prev.filter(r => r.resource_id !== resource.id);
      return [...prev, { resource_id: resource.id, quantity: 1 }];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await eventsAPI.create({ ...form, resources: selectedResources });
      setSuccess('Event submitted for admin approval.');
      setTimeout(() => navigate('/faculty/events'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page animated">
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Create New Event</h1>
          <p className="page-subtitle">Fill in the details below. Your event will be reviewed by an admin.</p>
        </div>
      </div>

      {error && <div className="alert alert-error"><Icons.Alert /> {error}</div>}
      {success && <div className="alert alert-success"><Icons.Success /> {success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Event Details</span>
          </div>

          <div className="form-group">
            <label>Event Title *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
              placeholder="e.g. Annual Tech Symposium 2025"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the event, its objectives, and what attendees can expect..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Venue</label>
              <input
                value={form.venue}
                onChange={e => setForm({ ...form, venue: e.target.value })}
                placeholder="e.g. Main Auditorium, Room 201"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="time"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time *</label>
              <input
                type="time"
                value={form.end_time}
                onChange={e => setForm({ ...form, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ maxWidth: 200 }}>
            <label>Total Seats *</label>
            <input
              type="number"
              min="1"
              max="1000"
              value={form.total_seats}
              onChange={e => setForm({ ...form, total_seats: parseInt(e.target.value) })}
              required
            />
            <p className="form-hint">Maximum 1,000 seats per event</p>
          </div>

          <div className="form-row" style={{ marginTop: 15 }}>
            <div className="form-group" style={{ maxWidth: 200 }}>
              <label>Event Type *</label>
              <select
                value={form.is_paid ? 'paid' : 'free'}
                onChange={e => setForm({ ...form, is_paid: e.target.value === 'paid' })}
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {form.is_paid && (
              <div className="form-group" style={{ maxWidth: 200 }}>
                <label>Fee Amount (₹) *</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.fee}
                  onChange={e => setForm({ ...form, fee: e.target.value })}
                  required={form.is_paid}
                  placeholder="e.g. 500"
                />
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Request Resources</span>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 18, marginTop: -8 }}>
            Select the resources you need. The system will automatically check for scheduling conflicts.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {resources.map(r => {
              const isSelected = !!selectedResources.find(sr => sr.resource_id === r.id);
              const ResourceIcon = typeIcon[r.type] || Icons.Box;
              return (
                <div
                  key={r.id}
                  className={`resource-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleResource(r)}
                >
                  <div className="resource-card-icon">
                    <ResourceIcon />
                  </div>
                  <div className="resource-card-name">{r.name}</div>
                  <div className="resource-card-qty">Available: {r.total_quantity}</div>
                  {isSelected && (
                    <div className="resource-card-check">
                      <Icons.Check /> Selected
                    </div>
                  )}
                </div>
              );
            })}
            {resources.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 14, gridColumn: '1/-1' }}>No resources available</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/faculty/events')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
