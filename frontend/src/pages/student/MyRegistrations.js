import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { eventsAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const MyRegistrations = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    eventsAPI.myRegistrations().then(r => {
      setRegistrations(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="page"><p>Loading your tickets...</p></div>;

  const handleShowQR = (event) => {
    setSelectedEvent(event);
    setShowQRModal(true);
  };

  return (
    <div className="page animated">
      <h2 className="section-title">My Tickets</h2>

      {registrations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48, borderRadius: 'var(--border-radius-lg)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎟️</div>
          <p style={{ color: 'var(--text-muted)' }}>You haven't bought any tickets yet.</p>
        </div>
      ) : (
        <div className="events-grid">
          {registrations.map(event => {
            const isPast = new Date(event.date) < new Date();
            const qrData = JSON.stringify({ eventId: event.id, studentId: user.id });

            return (
              <div key={event.id} className="event-card" style={{ opacity: isPast ? 0.7 : 1 }}>
                <div className="event-image-placeholder" style={{ height: '90px' }}>
                  {event.title.includes('Tech') ? '💻' : event.title.includes('Sport') ? '🏅' : '🎫'}
                  <div className="ticket-price" style={{ background: isPast ? 'var(--text-muted)' : event.attended ? '#3B82F6' : '#10B981' }}>
                    {isPast ? 'Past Event' : event.attended ? 'Attended' : 'Access Granted'}
                  </div>
                </div>

                <div className="seats-left" style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Ordered {new Date(event.registered_at).toLocaleDateString()}
                </div>

                <h3 style={{ fontSize: '15px' }}>{event.title}</h3>

                <div className="event-meta-info" style={{ marginTop: '8px' }}>
                  📅 {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="event-meta-info">
                  🕒 {event.time} - {event.end_time}
                </div>
                {event.venue && (
                  <div className="event-meta-info">
                    📍 {event.venue}
                  </div>
                )}

                {!isPast && !event.attended && (
                  <button
                    onClick={() => handleShowQR(event)}
                    className="btn btn-primary"
                    style={{ marginTop: '12px', width: '100%', display: 'flex', justifyContent: 'center' }}
                  >
                    View Ticket QR
                  </button>
                )}

                {event.attended && (
                  <div style={{ marginTop: '12px', padding: '10px', background: '#eff6ff', borderRadius: '8px', fontSize: '12px', color: '#1d4ed8', textAlign: 'center', fontWeight: 'bold' }}>
                    ✅ Checked In
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal card" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h2>{selectedEvent.title} Ticket</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              Show this QR code at the entrance to check in.
            </p>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', display: 'inline-block' }}>
              <QRCode
                value={JSON.stringify({ eventId: selectedEvent.id, studentId: user.id })}
                size={200}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <button
                className="btn btn-outline"
                onClick={() => setShowQRModal(false)}
                style={{ width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
