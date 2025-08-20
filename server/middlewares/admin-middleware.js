const adminMiddleware = async (req, res, next) => {
   if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: User not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: You do not have admin permissions" });
  }

  next();
};

module.exports = adminMiddleware;
