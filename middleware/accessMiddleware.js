const accessMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      // Check if the user's role is in the list of allowed roles
      if (allowedRoles.includes(req.role)) {
        next();
      } else {
        res.status(403).json({ message: "Unauthorized access" });
      }
    };
  };
  
  module.exports = accessMiddleware;
  