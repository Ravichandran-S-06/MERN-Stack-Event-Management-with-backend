import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './EventDetailPage.css';

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/events/${id}`, {
          headers: { 'x-auth-token': token },
        });
        setEvent(response.data);
        setIsRegistered(response.data.isRegistered);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/events/${id}/register`, {}, {
        headers: { 'x-auth-token': token },
      });
      setIsRegistered(true);
      setRegistrationMessage('Registered for event successfully!');
    } catch (error) {
      console.error('Registration failed:', error);
      setRegistrationMessage('Already Registred for this event!');
    }
  };

  if (!event) return <div className="loading">Loading...</div>;

  return (
    <div className="event-detail-page">
      <div className="event-detail-container">
        <h2>{event.title}</h2>
        <p className="event-description">{event.description}</p>
        <p className="event-date">Date: {new Date(event.date).toLocaleDateString()}</p>
        {isRegistered ? (
          <p className="registration-status registered"></p>
        ) : (
          <button onClick={handleRegister} className="register-button">Register</button>
        )}
        {registrationMessage && (
          <p className={`registration-message ${isRegistered ? 'success' : 'error'}`}>
            {registrationMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;