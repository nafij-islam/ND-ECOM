// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser } = require('../controller/authController');

router.post('/register', registerUser);

router.get('/', (req, res) => {
  res.json({ message: 'Auth endpoint is working' });
});

module.exports = router;
