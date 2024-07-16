import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [activeView, setActiveView] = useState('addEvents');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/events', {
        headers: { 'x-auth-token': token },
      });
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events with participants:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/events', { title, description, date }, {
        headers: { 'x-auth-token': token },
      });
      setTitle('');
      setDescription('');
      setDate('');
      fetchEvents();
    } catch (err) {
      console.error('Event creation failed:', err);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-dashboard">
      <button className="sidebar-toggle d-md-none" onClick={toggleSidebar}>
        ☰
      </button>
      <div className={`row no-gutters ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="col-md-3 sidebar">
          <h2 className="mb-4">Admin Dashboard</h2>
          <div className="d-flex flex-column">
            <button
              className={`btn btn-primary mb-3 ${activeView === 'addEvents' ? 'active' : ''}`}
              onClick={() => {
                setActiveView('addEvents');
                setSidebarOpen(false);
              }}
            >
              Add Events
            </button>
            <button
              className={`btn btn-primary mb-3 ${activeView === 'participants' ? 'active' : ''}`}
              onClick={() => {
                setActiveView('participants');
                setSidebarOpen(false);
              }}
            >
              Registered Participants
            </button>
          </div>
        </div>
        <div className="col-md-9 main-content">
          {activeView === 'addEvents' && (
            <div className="add-events">
              <h3>Add New Event</h3>
              <div className="form-container">
                <form onSubmit={handleCreateEvent}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Event Title"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Event Description"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="date"
                      className="form-control"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success">Create Event</button>
                </form>
              </div>
            </div>
          )}
          {activeView === 'participants' && (
            <div className="registered-participants">
              <h3>Registered Participants</h3>
              <div className="row">
                <div className="col-md-4 events-sidebar">
                  <ul className="list-group">
                    {events.map((event) => (
                      <li
                        key={event._id}
                        className={`list-group-item ${selectedEvent && selectedEvent._id === event._id ? 'active' : ''}`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        {event.title}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-8">
                  {selectedEvent && (
                    <div className="event-details">
                      <h4>{selectedEvent.title}</h4>
                      <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
                      <p><strong>Description:</strong> {selectedEvent.description}</p>
                      <h5>Participants:</h5>
                      <ul className="list-group">
                        {selectedEvent.participants.map((participant) => (
                          <li className="list-group-item" key={participant._id}>
                            {participant.name} - {participant.email}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;