const { body } = require('express-validator');

exports.registerValidator = [
  body('email').isEmail().withMessage('Invalid email'),
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').exists().withMessage('Password is required')
];

exports.postValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
];

exports.commentValidator = [
  body('postId').notEmpty().withMessage('postId is required'),
  body('content').notEmpty().withMessage('Content is required')
];
