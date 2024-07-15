// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hardcoded admin credentials
const adminCredentials = {
  email: 'admin@vvce.ac.in',
  password: 'admin'
};

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    // console.log('User registered:', user);
    res.status(201).send('User registered');
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(400).send('Error registering user');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Check if the credentials match admin credentials
  if (email === adminCredentials.email && password === adminCredentials.password) {
    const isAdmin = true; // Set admin flag
    const token = jwt.sign({ email: adminCredentials.email, isAdmin }, 'secret', {
      expiresIn: '1h',
    });
    return res.json({ token, user: { email: adminCredentials.email, isAdmin } });
  }
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 'secret', {
      expiresIn: '1h',
    });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(400).send('Error logging in');
  }
});

module.exports = router;
