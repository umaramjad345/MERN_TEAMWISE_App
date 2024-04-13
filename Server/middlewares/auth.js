import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuthorized = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const resp = await User.findById(decodedToken.id).select("isAdmin email");

      req.user = {
        email: resp.email,
        isAdmin: resp.isAdmin,
        userId: decodedToken.id,
      };

      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Not authorized, Try Login Again" });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }
};

export const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Only Admins are Allowed to Access this Resource",
    });
  }
};
