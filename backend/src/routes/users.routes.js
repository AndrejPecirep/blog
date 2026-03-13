const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser
} = require('../controllers/users.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// 🔐 Sve rute ispod zahtijevaju login
router.use(authMiddleware);

// 👤 Ažuriraj vlastiti profil
router.put('/me', updateProfile);

// 👤 Dohvati korisnika po ID-u
router.get('/:id', getUserById);

// 🔐 ADMIN rute
router.get('/', (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  getAllUsers(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  deleteUser(req, res, next);
});

module.exports = router;
