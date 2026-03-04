import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const StudentHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    eventsAPI.getAll().then(r => setEvents(r.data));
  }, []);

  const categories = ['All', 'Seminars', 'Workshops', 'Sports', 'Cultural'];

  const filteredEvents = events.filter(e => {
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    // Assuming categorization by title for demo purposes
    if (category !== 'All') {
      if (category === 'Seminars' && !e.title.toLowerCase().includes('seminar')) return false;
      if (category === 'Workshops' && !e.title.toLowerCase().includes('workshop')) return false;
      if (category === 'Sports' && !e.title.toLowerCase().includes('sport')) return false;
    }
    return true;
  });

  return (
    <div className="page animated">

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="What event are you looking for?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="filter-btn">
          <span>⚙️</span>
        </button>
      </div>

      {/* Categories */}
      <div className="category-scroll">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-pill ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat === 'All' ? '🎯' : cat === 'Seminars' ? '📚' : cat === 'Workshops' ? '🛠️' : '🏆'} {cat}
          </button>
        ))}
      </div>

      {/* Featured Banner */}
      <div className="featured-banner">
        <h2>Get 30% OFF on Tech Symposium Tickets!</h2>
        <p>Limited time offer for early birds. Register now!</p>
        <button className="banner-btn" onClick={() => navigate('/student/events')}>
          🎟️ Register Now
        </button>
        <div className="banner-image"></div>
      </div>

      <h2 className="section-title">Upcoming Events</h2>

      <div className="events-grid">
        {filteredEvents.map(e => {
          const seatsLeft = e.total_seats - e.registered_seats;
          return (
            <div key={e.id} className="event-card" onClick={() => navigate('/student/events')}>
              <div className="event-image-placeholder">
                {e.title.includes('Tech') ? '💻' : e.title.includes('Sport') ? '🏅' : '🎉'}
                <div className="ticket-price">Free</div>
                <div className="fav-btn">🤍</div>
              </div>

              <div className="seats-left">
                {seatsLeft} Seats Left
              </div>

              <div className="rating-info">
                ⭐ 4.8 <span>(120)</span>
              </div>

              <h3>{e.title}</h3>

              <div className="event-meta-info">
                📅 {new Date(e.date).toLocaleDateString()}
              </div>
              <div className="event-meta-info">
                📍 {e.venue || 'TBA'}
              </div>
            </div>
          );
        })}
        {filteredEvents.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '20px' }}>
            No events found matching your criteria.
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentHome;
