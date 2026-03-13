const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost
} = require('../controllers/posts.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');

// Multer setup za upload slika
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder za upload
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// 📝 CRUD RUTE ZA POSTOVE

// Kreiraj post (auth + upload slike)
router.post('/', authMiddleware, upload.single('image'), createPost);

// Dohvati sve postove (pagination)
router.get('/', getPosts);

// Dohvati post po slug-u
router.get('/:slug', getPostBySlug);

// Update posta (auth)
router.put('/:id', authMiddleware, upload.single('image'), updatePost);

// Delete posta (auth)
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
