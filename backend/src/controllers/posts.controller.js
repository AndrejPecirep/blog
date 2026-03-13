const { Op } = require('sequelize');
const { Post, Tag, PostTag, User, Comment } = require('../models');
const slugify = require('../utils/slugify');
const fs = require('fs');
const path = require('path');

const parseTags = (rawTags) => {
  if (!rawTags) return [];
  if (Array.isArray(rawTags)) {
    return rawTags.map((tag) => `${tag}`.trim()).filter(Boolean);
  }

  return `${rawTags}`
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const buildUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = slugify(title) || 'untitled-post';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Post.findOne({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
};

const attachTags = async (postId, tags) => {
  await PostTag.destroy({ where: { postId } });

  for (const tagName of tags) {
    const [tag] = await Tag.findOrCreate({ where: { name: tagName } });
    await PostTag.findOrCreate({ where: { postId, tagId: tag.id } });
  }
};

const includeConfig = [
  { model: User, as: 'author', attributes: ['id', 'username', 'avatarUrl', 'bio'] },
  { model: Tag, through: { attributes: [] } }
];

const mapPostMeta = async (post) => {
  const commentsCount = await Comment.count({ where: { postId: post.id } });
  const plain = post.toJSON();
  const words = plain.content ? plain.content.trim().split(/\s+/).filter(Boolean).length : 0;

  return {
    ...plain,
    commentsCount,
    readingTime: Math.max(1, Math.ceil(words / 180))
  };
};

const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const tags = parseTags(req.body.tags);

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const slug = await buildUniqueSlug(title);
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const post = await Post.create({
      title: title.trim(),
      slug,
      content: content.trim(),
      imageUrl,
      userId: req.user.id
    });

    if (tags.length) {
      await attachTags(post.id, [...new Set(tags)]);
    }

    const fullPost = await Post.findByPk(post.id, { include: includeConfig });
    res.status(201).json(await mapPostMeta(fullPost));
  } catch (err) {
    next(err);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(12, Math.max(1, parseInt(req.query.limit, 10) || 9));
    const offset = (page - 1) * limit;
    const q = req.query.q?.trim();
    const tag = req.query.tag?.trim();
    const authorId = req.query.authorId ? Number(req.query.authorId) : null;

    const where = {};
    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { content: { [Op.like]: `%${q}%` } }
      ];
    }
    if (authorId) {
      where.userId = authorId;
    }

    const include = [...includeConfig];
    if (tag) {
      include[1] = {
        model: Tag,
        where: { name: tag },
        through: { attributes: [] }
      };
    }

    const { count, rows } = await Post.findAndCountAll({
      where,
      include,
      distinct: true,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const posts = await Promise.all(rows.map(mapPostMeta));
    const allTags = await Tag.findAll({ order: [['name', 'ASC']] });

    res.json({
      posts,
      total: count,
      page,
      totalPages: Math.max(1, Math.ceil(count / limit)),
      availableTags: allTags.map((item) => item.name)
    });
  } catch (err) {
    next(err);
  }
};

const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { slug: req.params.slug },
      include: includeConfig
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(await mapPostMeta(post));
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const nextTitle = req.body.title?.trim();
    const nextContent = req.body.content?.trim();
    const tags = req.body.tags !== undefined ? parseTags(req.body.tags) : null;

    if (nextTitle) {
      post.title = nextTitle;
      post.slug = await buildUniqueSlug(nextTitle, post.id);
    }
    if (nextContent) post.content = nextContent;

    if (req.file) {
      if (post.imageUrl) {
        const oldPath = path.join(process.cwd(), post.imageUrl.replace(/^\//, ''));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      post.imageUrl = `/uploads/${req.file.filename}`;
    }

    await post.save();

    if (tags) {
      await attachTags(post.id, [...new Set(tags)]);
    }

    const fullPost = await Post.findByPk(post.id, { include: includeConfig });
    res.json(await mapPostMeta(fullPost));
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (post.imageUrl) {
      const filePath = path.join(process.cwd(), post.imageUrl.replace(/^\//, ''));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await PostTag.destroy({ where: { postId: post.id } });
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
