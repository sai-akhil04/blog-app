// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './components/Public/Home';
import BlogPost from './components/Public/BlogPost';
import AdminDashboard from './components/Admin/AdminDashboard';
import CreatePost from './components/Admin/CreatePost';
import EditPost from './components/Admin/EditPost';
import PostList from './components/Admin/PostList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Helmet>
          <title>My Blog - Share Your Stories</title>
          <meta name="description" content="A modern blog platform for sharing stories and insights" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
        
        <Header />
        
        <main style={{ minHeight: 'calc(100vh - 200px)' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<BlogPost />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/create" element={<CreatePost />} />
            <Route path="/admin/posts" element={<PostList />} />
            <Route path="/admin/edit/:slug" element={<EditPost />} />
            
            {/* 404 Route */}
            <Route path="*" element={
              <div className="container">
                <div className="card" style={{ textAlign: 'center' }}>
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn btn-primary">Go Home</a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;