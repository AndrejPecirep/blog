const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorMiddleware } = require('./src/middlewares/error.middleware');

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/users.routes');
const postRoutes = require('./src/routes/posts.routes');
const commentRoutes = require('./src/routes/comments.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Rute
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Error handler
app.use(errorMiddleware);

module.exports = app;
