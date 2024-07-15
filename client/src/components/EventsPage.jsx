// src/components/EventsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './EventsPage.css';

function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get('/api/events');
      setEvents(res.data);
    };
    fetchEvents();
  }, []);

  return (
    <div className="events-page">
      <h2>Events</h2>
      <div className="events-grid">
        {events.map((event) => (
          <Link to={`/events/${event._id}`} key={event._id} className="event-box">
            <h3>{event.title}</h3>
            <p>{new Date(event.date).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default EventsPage;