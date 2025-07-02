// client/src/components/Layout/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      background: '#333', 
      color: 'white', 
      textAlign: 'center', 
      padding: '2rem 0', 
      marginTop: '4rem' 
    }}>
      <div className="container">
        <p>&copy; 2025 My Blog. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

