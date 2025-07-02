// client/src/components/Admin/PostList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts, deletePost } from '../../services/api';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getAllPosts();
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeleteLoading({ ...deleteLoading, [slug]: true });

    try {
      await deletePost(slug);
      setPosts(posts.filter(post => post.slug !== slug));
    } catch (err) {
      setError('Failed to delete post');
    } finally {
      setDeleteLoading({ ...deleteLoading, [slug]: false });
    }
  };

  if (loading) return <div className="loading">Loading posts...</div>;

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Manage Posts</h1>
          <Link to="/admin/create" className="btn btn-primary">
            Create New Post
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>No posts found.</p>
            <Link to="/admin/create" className="btn btn-primary">
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="post-list">
            {posts.map((post) => (
              <div key={post._id} className="post-item">
                <div className="post-info">
                  <h3>{post.title}</h3>
                  <div className="post-meta">
                    <p>
                      Created: {new Date(post.createdAt).toLocaleDateString()}
                      {post.updatedAt !== post.createdAt && (
                        <span> • Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                      )}
                    </p>
                    <p>Slug: <code>{post.slug}</code></p>
                  </div>
                </div>
                <div className="post-actions">
                  <Link 
                    to={`/post/${post.slug}`} 
                    className="btn btn-secondary btn-small"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </Link>
                  <Link 
                    to={`/admin/edit/${post.slug}`} 
                    className="btn btn-primary btn-small"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug, post.title)}
                    className="btn btn-danger btn-small"
                    disabled={deleteLoading[post.slug]}
                  >
                    {deleteLoading[post.slug] ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;