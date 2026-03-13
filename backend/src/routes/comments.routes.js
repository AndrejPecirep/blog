const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment
} = require('../controllers/comments.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Get all comments for a specific post (no authentication required)
router.get('/post/:postId', getCommentsByPost);

// Creating, updating, and deleting comments requires authentication
router.post('/', authMiddleware, createComment);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
