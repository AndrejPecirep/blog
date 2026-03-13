const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { registerValidator, loginValidator } = require('../utils/validators');
const { validationResult } = require('express-validator');

// Registracija
router.post('/register', registerValidator, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  register(req, res, next);
});

// Login
router.post('/login', loginValidator, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  login(req, res, next);
});

// Dohvati profil
router.get('/me', authMiddleware, me);

module.exports = router;
