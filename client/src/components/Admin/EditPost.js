import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getPostBySlug, updatePost } from '../../services/api';
import { createSlug } from '../../utils/slugify';

const EditPost = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [originalTitle, setOriginalTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await getPostBySlug(slug);
      const post = response.data;
      setFormData({
        title: post.title,
        content: post.content
      });
      setOriginalTitle(post.title);
    } catch (err) {
      setError('Failed to fetch post');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await updatePost(slug, formData);
      setSuccess('Post updated successfully!');

      if (formData.title !== originalTitle) {
        setTimeout(() => {
          navigate(`/admin/edit/${response.data.slug}`); // ✅ Fixed
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const previewSlug = formData.title && formData.title !== originalTitle
    ? createSlug(formData.title)
    : slug;

  if (fetchLoading) return <div className="loading">Loading post...</div>;

  return (
    <div className="container">
      <div className="card">
        <h1>Edit Post</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL Slug</label>
            <input
              type="text"
              value={previewSlug}
              className="form-input"
              readOnly
              style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}
            />
            {formData.title !== originalTitle && (
              <small style={{ color: '#dc3545' }}>
                Slug will change when you save
              </small>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={quillModules}
              placeholder="Write your post content here..."
              className="quill-editor"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Post'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/admin/posts')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
