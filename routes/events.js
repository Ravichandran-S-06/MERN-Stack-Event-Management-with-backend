const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    console.log('Access denied. No token provided.');
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, 'secret'); // Replace 'secret' with your actual JWT secret
    req.user = decoded;
    next();
  } catch (ex) {
    console.log('Invalid token.');
    res.status(400).send('Invalid token.');
  }
};

// POST: Create a new event (admin only)
router.post('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).send('Access denied.');

  const { title, description, date } = req.body;

  try {
    const event = new Event({
      title,
      description,
      date,
    });

    await event.save();
    res.status(201).send('Event created successfully.');
  } catch (err) {
    console.log('Error creating event:', err);
    res.status(400).send('Error creating event.');
  }
});

// GET: Fetch all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('participants', 'name email');
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(400).send('Error fetching events.');
  }
});

// GET: Fetch single event by ID
router.get('/:id', async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId).populate('participants', 'name email');
    if (!event) return res.status(404).send('Event not found.');
    res.json(event);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(400).send('Error fetching event.');
  }
});

// POST: Register user for an event
router.post('/:id/register', auth, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).send('Event not found.');

    // Check if user is already registered
    if (event.participants.includes(userId)) {
      return res.status(400).send('User already registered for this event.');
    }

    event.participants.push(userId);
    await event.save();

    res.send('Registered for event successfully.');
  } catch (err) {
    console.error('Error registering for event:', err);
    res.status(400).send('Error registering for event.');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find().populate('participants', 'name email');
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(400).send('Error fetching events.');
  }
});



module.exports = router;
