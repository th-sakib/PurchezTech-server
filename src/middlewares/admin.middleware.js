import User from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
  const email = req.user.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(403).json({
        message: "Access Forbidden",
      });
    }

    const checkAdmin = user.role === "admin";
    if (!checkAdmin) {
      return res.status(403).json({
        message: "Access Forbidden",
      });
    }
  } catch (error) {
    res.status(403).json({
      message: "Access Forbidden",
    });
  }
  next();
};

export default isAdmin;
