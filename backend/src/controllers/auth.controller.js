const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const existing = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existing) {
      return res.status(400).json({
        message: existing.email === email ? 'Email already in use' : 'Username already in use'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.trim().toLowerCase(),
      username: username.trim(),
      password: passwordHash
    });

    const token = signToken({ id: user.id });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        role: user.role
      },
      token
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ id: user.id });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'username', 'bio', 'avatarUrl', 'role', 'createdAt']
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};
