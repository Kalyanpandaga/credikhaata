const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/constants");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minLength: 5,
      maxLength: 100,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email address, invalid email: " + value);
        }
      },
    },
    password: {
      type: String,
      minLength: 5,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password must be strong (min 8 chars, with letters, numbers & symbols)"
          );
        }
      },
    },
    role: {
      type: String,
      enum: ["ADMIN", "MERCHANT"],
      default: "MERCHANT",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ userId: user._id }, JWT_PRIVATE_KEY, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashedPassword = user.password;

  const isPosswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashedPassword
  );
  return isPosswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
