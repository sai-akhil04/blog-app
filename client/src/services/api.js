import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const ADMIN_TOKEN = process.env.REACT_APP_ADMIN_TOKEN || 'admin-token';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token for admin requests
const setAuthToken = () => {
  api.defaults.headers.authorization = `Bearer ${ADMIN_TOKEN}`;
};

// Remove auth token
const removeAuthToken = () => {
  delete api.defaults.headers.authorization;
};

// Public API calls
export const getPublicPosts = () => api.get('/posts/public');
export const getPostBySlug = (slug) => api.get(`/posts/${slug}`);

// Admin API calls (require authentication)
export const getAllPosts = () => {
  setAuthToken();
  return api.get('/posts');
};

export const createPost = (postData) => {
  setAuthToken();
  return api.post('/posts', postData);
};

export const updatePost = (slug, postData) => {
  setAuthToken();
  return api.put(`/posts/${slug}`, postData);
};

export const deletePost = (slug) => {
  setAuthToken();
  return api.delete(`/posts/${slug}`);
};

export default api;

// client/src/utils/slugify.js
export const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};