const bcrypt = require('bcryptjs');
const { User } = require('../models');

// 🔐 Dohvati sve korisnike (ADMIN)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'username', 'bio', 'avatarUrl', 'role']
    });
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

// 👤 Dohvati korisnika po ID-u
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'email', 'username', 'bio', 'avatarUrl', 'role']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// ✏️ Ažuriranje vlastitog profila
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { username, bio, avatarUrl, password } = req.body;

    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
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

// 🗑 Brisanje korisnika (ADMIN)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
