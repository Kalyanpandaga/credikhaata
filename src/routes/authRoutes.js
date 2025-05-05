const express = require("express");
const { signup, login } = require("../controllers/authController");
const validateRequest = require("../middleware/validateMiddleware");
const {
  validateSignupData,
  validateLoginData,
} = require("../utils/validations/validateUserData");

const authRouter = express.Router();

authRouter.post("/signup", validateRequest(validateSignupData), signup);

const rateLimit = require("express-rate-limit");
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many login attempts. Please try again later.",
});
authRouter.post(
  "/login",
  loginLimiter,
  validateRequest(validateLoginData),
  login
);

module.exports = authRouter;
