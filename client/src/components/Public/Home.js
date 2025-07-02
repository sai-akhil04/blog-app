// client/src/components/Public/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublicPosts } from '../../services/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getPublicPosts();
      setPosts(response.data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.response?.data?.error || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <div className="card">
        <h1>Welcome to My Blog</h1>
        <p>Discover amazing articles and insights on various topics.</p>
      </div>

      {posts.length === 0 ? (
        <div className="card">
          <p>No posts available yet. Check back later!</p>
        </div>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <div key={post._id} className="post-item card" style={{ marginBottom: '1rem' }}>
              <div className="post-info">
                <h3>
                  <Link 
                    to={`/post/${post.slug}`}
                    style={{ 
                      textDecoration: 'none', 
                      color: '#007bff' 
                    }}
                  >
                    {post.title}
                  </Link>
                </h3>
                <div className="post-meta">
                  Published on {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <p style={{ marginTop: '0.5rem', color: '#444' }}>
                  {(post.content || '').replace(/<[^>]+>/g, '').substring(0, 150)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
