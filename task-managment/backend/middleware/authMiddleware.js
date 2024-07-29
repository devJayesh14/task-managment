const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  if (req.url == "/login" || req.url == "/register") {
    return next();
  }
  const token = req.header('auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid',code:1 });
  }
};
