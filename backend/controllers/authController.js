const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Inscription
// @route   POST /api/auth/register
const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'already taken' });
    }

    const user = await User.create({ username, password });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Connexion
// @route   POST /api/auth/login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Username or password incorrect' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Profil courant
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user); // injecté par le middleware protect
};

module.exports = { register, login, getMe };