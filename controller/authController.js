// controller/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, terms } = req.body;

    if (!email || !password || terms === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and accept terms',
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain at least one letter and one number',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashPassword,
      terms,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
};
