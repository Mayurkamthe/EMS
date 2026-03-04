import React, { useEffect, useState } from 'react';
import { reportsAPI } from '../../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Icons = {
  Calendar: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3.5" width="16" height="14" rx="2"/><path d="M6 2v3M14 2v3M2 8h16"/>
    </svg>
  ),
  Resource: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17V7l7-4 7 4v10"/><path d="M8 17v-5h4v5"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8"/><path d="M10 6v4l3 3"/>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="7" r="3"/><path d="M1 17c0-3 2.9-5 6.5-5"/>
      <circle cx="14" cy="7" r="3"/><path d="M10 17c0-3 2.9-5 6-5"/>
    </svg>
  ),
  Download: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3v10M6 9l4 4 4-4"/><path d="M3 17h14"/>
    </svg>
  ),
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportsAPI.getStats().then(r => { setStats(r.data); setLoading(false); });
  }, []);

  const handlePDF = async () => {
    const res = await reportsAPI.downloadPDF();
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url; a.download = 'events-report.pdf'; a.click();
  };

  if (loading) return (
    <div className="page page-loading">
      <div className="spinner" />
    </div>
  );

  return (
    <div className="page animated">
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your event management system</p>
        </div>
        <button className="btn btn-primary" onClick={handlePDF}>
          <Icons.Download />
          Export PDF
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-card blue">
          <div className="stat-icon"><Icons.Calendar /></div>
          <div className="stat-number">{stats.totalEvents}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><Icons.Resource /></div>
          <div className="stat-number">{stats.totalResources}</div>
          <div className="stat-label">Resources</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon"><Icons.Clock /></div>
          <div className="stat-number">{stats.pendingApprovals}</div>
          <div className="stat-label">Pending Approvals</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon"><Icons.Users /></div>
          <div className="stat-number">{stats.totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title">Monthly Events ({new Date().getFullYear()})</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={stats.monthlyCount} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECEEF2" vertical={false} />
              <XAxis dataKey="month" fontSize={11} tick={{ fill: '#7A859A' }} axisLine={false} tickLine={false} />
              <YAxis fontSize={11} tick={{ fill: '#7A859A' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E2E5EC', borderRadius: 10, fontSize: 13, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                cursor={{ fill: '#EEF2F9' }}
              />
              <Bar dataKey="count" fill="#1B3A6B" radius={[5, 5, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <span className="card-title">Most Used Resources</span>
          </div>
          {stats.mostUsedResources.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <p>No resource data yet</p>
            </div>
          ) : (
            stats.mostUsedResources.map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < stats.mostUsedResources.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700, fontSize: 12 }}>{i + 1}</div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-heading)' }}>{r.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '3px 10px', borderRadius: 'var(--r-pill)' }}>{r.usage_count} bookings</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Upcoming Events</span>
        </div>
        {stats.upcomingEvents.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 0' }}>
            <p>No upcoming events scheduled</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {stats.upcomingEvents.map(e => (
              <div key={e.id} className="upcoming-event-card">
                <div className="upcoming-event-title">{e.title}</div>
                <div className="upcoming-event-meta">
                  {new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} &bull; {e.time}
                </div>
                <div className="upcoming-event-seats">{e.registered_seats}/{e.total_seats} seats filled</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
