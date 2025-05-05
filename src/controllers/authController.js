const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, emailId, password, role } = req.body;

    const normalizedEmail = emailId.trim().toLowerCase();

    const existingUser = await User.findOne({ emailId: normalizedEmail });
    if (existingUser) {
      return errorResponse(
        res,
        400,
        "EMAIL_ALREADY_REGISTERED",
        "Email already registered"
      );
    }

    const user = new User({
      firstName,
      lastName,
      emailId: normalizedEmail,
      password,
    });
    if (role) user.role = role;
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error user registration:", error);
    return errorResponse(res, 500, "USER_REGISTRATION_ERROR", error.message);
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const normalizedEmail = emailId.trim().toLowerCase();

    const user = await User.findOne({ emailId: normalizedEmail });
    if (!user)
      return errorResponse(
        res,
        401,
        "INVALID_CREDENTIALS",
        "Invalid credentials"
      );

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid)
      return errorResponse(
        res,
        401,
        "INVALID_CREDENTIALS",
        "Invalid credentials"
      );

    const token = await user.getJwt();

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        emailId: user.emailId,
      },
    });
  } catch (error) {
    console.error("Error user login:", error);
    return errorResponse(res, 500, "USER_LOGIN_ERROR", error.message);
  }
};

module.exports = {
  signup,
  login,
};
