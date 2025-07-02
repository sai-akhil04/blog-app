import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container">
      <div className="card">
        <h1>Admin Dashboard</h1>
        <p>Manage your blog posts from here.</p>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Link to="/admin/create" className="btn btn-primary">
            Create New Post
          </Link>
          <Link to="/admin/posts" className="btn btn-secondary">
            Manage Posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
