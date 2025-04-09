const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    console.log("token", token);

    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: Token missing' });
    }

   
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    req.user = { id: decoded.id };
    console.log("req.user", req.user);

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};

module.exports = authentication;
