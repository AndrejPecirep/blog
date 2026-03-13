const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment
} = require('../controllers/comments.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Dohvat svih komentara za određeni post (nije potrebna autentifikacija)
router.get('/post/:postId', getCommentsByPost);

// Kreiranje, update i brisanje komentara zahtijevaju autentifikaciju
router.post('/', authMiddleware, createComment);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
