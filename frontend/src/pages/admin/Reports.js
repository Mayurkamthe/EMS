import React, { useEffect, useState } from 'react';
import { reportsAPI, eventsAPI } from '../../utils/api';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    reportsAPI.getStats().then(r => setStats(r.data));
    eventsAPI.getAll().then(r => setEvents(r.data));
  }, []);

  const handlePDF = async () => {
    const res = await reportsAPI.downloadPDF();
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url; a.download = 'college-ems-report.pdf'; a.click();
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>📋 Reports & Analytics</h1>
        <button className="btn btn-primary" onClick={handlePDF}>📥 Download PDF Report</button>
      </div>

      {stats && (
        <div className="stat-grid" style={{ marginBottom: 28 }}>
          <div className="stat-card blue"><div className="stat-number">{stats.totalEvents}</div><div className="stat-label">Total Events</div></div>
          <div className="stat-card green"><div className="stat-number">{events.filter(e => e.status === 'approved').length}</div><div className="stat-label">Approved</div></div>
          <div className="stat-card orange"><div className="stat-number">{stats.pendingApprovals}</div><div className="stat-label">Pending</div></div>
          <div className="stat-card purple"><div className="stat-number">{stats.totalStudents}</div><div className="stat-label">Students</div></div>
        </div>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Event</th><th>Date</th><th>Organizer</th><th>Status</th><th>Registrations</th><th>Venue</th></tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id}>
                <td><strong>{e.title}</strong></td>
                <td>{new Date(e.date).toLocaleDateString()}</td>
                <td>{e.creator_name}</td>
                <td><span className={`badge badge-${e.status}`}>{e.status}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {e.registered_seats}/{e.total_seats}
                    <div style={{ width: 60, height: 6, background: '#e0e0e0', borderRadius: 3 }}>
                      <div style={{ width: `${(e.registered_seats / e.total_seats) * 100}%`, height: '100%', background: '#1a237e', borderRadius: 3 }} />
                    </div>
                  </div>
                </td>
                <td>{e.venue || '—'}</td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30, color: '#999' }}>No events</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
