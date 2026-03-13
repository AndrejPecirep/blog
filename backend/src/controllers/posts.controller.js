const { Post, Tag, PostTag, User } = require('../models');
const slugify = require('../utils/slugify');
const fs = require('fs');
const path = require('path');

/**
 * Kreiranje novog posta
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    const imageFile = req.file; // ako koristiš multer za upload

    // Generiranje slug-a iz naslova
    const slug = slugify(title);

    // Spremanje URL slike (ako postoji)
    const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : null;

    const post = await Post.create({
      title,
      slug,
      content,
      imageUrl,
      userId: req.user.id
    });

    // Ako postoje tagovi
    if (tags && tags.length > 0) {
      for (let tagName of tags) {
        let [tag] = await Tag.findOrCreate({ where: { name: tagName } });
        await PostTag.create({ postId: post.id, tagId: tag.id });
      }
    }

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

/**
 * Dohvati sve postove (s pagination)
 */
const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Tag, through: { attributes: [] } }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      posts: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Dohvati post po slug-u
 */
const getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({
      where: { slug },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Tag, through: { attributes: [] } }
      ]
    });

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (err) {
    next(err);
  }
};

/**
 * Update posta
 */
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (title) post.title = title;
    if (title) post.slug = slugify(title); // update slug ako je title promijenjen
    if (content) post.content = content;

    await post.save();

    // Update tagova (po potrebi)
    if (tags) {
      // Obriši postojeće tagove
      await PostTag.destroy({ where: { postId: post.id } });

      for (let tagName of tags) {
        let [tag] = await Tag.findOrCreate({ where: { name: tagName } });
        await PostTag.create({ postId: post.id, tagId: tag.id });
      }
    }

    res.json(post);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete posta
 */
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Opcionalno: obriši sliku s diska
    if (post.imageUrl) {
      const filePath = path.join(__dirname, '../', post.imageUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost
};
