const { Comment, Post, User } = require('../models');

// Create comment
exports.createComment = async (req, res, next) => {
  try {
    const { postId, content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      content,
      postId,
      userId: req.user.id
    });

    const fullComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        }
      ]
    });

    res.status(201).json({ comment: fullComment });
  } catch (err) {
    next(err);
  }
};

// Get comments for a post
exports.getCommentsByPost = async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json({ comments });
  } catch (err) {
    next(err);
  }
};

// Update comment (author)
exports.updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    comment.content = req.body.content;
    await comment.save();

    res.json({ comment });
  } catch (err) {
    next(err);
  }
};

// Delete comment (author or admin)
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    next(err);
  }
};
