// client/src/components/Public/BlogPost.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getPostBySlug } from '../../services/api';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await getPostBySlug(slug);
      setPost(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Post not found');
      } else {
        setError('Failed to fetch post');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div className="error">Post not found</div>;

  return (
    <>
      <Helmet>
        <title>{post.title} - My Blog</title>
        <meta name="description" content={post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.title} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.createdAt} />
        <meta property="article:modified_time" content={post.updatedAt} />
      </Helmet>
      
      <div className="container">
        <article className="blog-post card">
          <h1>{post.title}</h1>
          <div className="blog-meta">
            <p>
              Published on {new Date(post.createdAt).toLocaleDateString()}
              {post.updatedAt !== post.createdAt && (
                <span> • Updated on {new Date(post.updatedAt).toLocaleDateString()}</span>
              )}
            </p>
          </div>
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </>
  );
};

export default BlogPost;