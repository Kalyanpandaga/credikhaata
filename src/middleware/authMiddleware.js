const jwt = require("jsonwebtoken");
const User = require("../models/User");

const errorResponse = require("../utils/errorResponse");

const { JWT_PRIVATE_KEY } = require("../config/constants");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Authentication required");
    }

    const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
    const user = await User.findOne({ _id: decoded.userId }).select(
      "-password"
    );

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    errorResponse(res, 401, "AUTHENTICATION_ERROR", error.message);
  }
};

module.exports = authMiddleware;
