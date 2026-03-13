const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user; // ✅ STANDARD
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
