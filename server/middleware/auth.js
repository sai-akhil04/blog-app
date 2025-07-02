const authenticateAdmin = (req, res, next) => {
  // Simple authentication for demo purposes
  // In production, implement proper JWT authentication
  const authHeader = req.headers.authorization;
  
  if (!authHeader || authHeader !== 'Bearer admin-token') {
    return res.status(401).json({ error: 'Unauthorized access' });
  }
  
  next();
};

module.exports = { authenticateAdmin };