// server/routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { authenticateAdmin } = require('../middleware/auth');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Helper function to create slug
const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// GET /api/posts - Get all posts (admin)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/public - Get all posts (public, limited data)
router.get('/public', async (req, res) => {
  try {
    const posts = await Post.find()
      .select('title slug createdAt')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/:slug - Get single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api/posts - Create new post
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Sanitize content
    const sanitizedContent = DOMPurify.sanitize(content);
    
    // Generate slug
    let slug = createSlug(title);
    
    // Check if slug exists and make it unique
    let existingPost = await Post.findOne({ slug });
    let counter = 1;
    const originalSlug = slug;
    
    while (existingPost) {
      slug = `${originalSlug}-${counter}`;
      existingPost = await Post.findOne({ slug });
      counter++;
    }

    const post = new Post({
      title,
      content: sanitizedContent,
      slug
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// PUT /api/posts/:slug - Update post
router.put('/:slug', authenticateAdmin, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Sanitize content
    const sanitizedContent = DOMPurify.sanitize(content);
    
    // Update slug if title changed
    let newSlug = post.slug;
    if (title !== post.title) {
      newSlug = createSlug(title);
      
      // Check if new slug exists
      let existingPost = await Post.findOne({ slug: newSlug, _id: { $ne: post._id } });
      let counter = 1;
      const originalSlug = newSlug;
      
      while (existingPost) {
        newSlug = `${originalSlug}-${counter}`;
        existingPost = await Post.findOne({ slug: newSlug, _id: { $ne: post._id } });
        counter++;
      }
    }

    post.title = title;
    post.content = sanitizedContent;
    post.slug = newSlug;
    post.updatedAt = Date.now();

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/posts/:slug - Delete post
router.delete('/:slug', authenticateAdmin, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;