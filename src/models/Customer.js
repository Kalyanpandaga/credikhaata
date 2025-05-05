const mongoose = require("mongoose");
const validator = require("validator");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error("Invalid mobile number: " + value);
        }
      },
    },
    address: {
      type: String,
      required: true,
      maxLength: 250,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trustScore: {
      type: Number,
      required: true,
      min: [0, "Trust score cannot be less than 0"],
      max: [10, "Trust score cannot exceed 10"],
    },
    creditLimit: {
      type: Number,
      required: true,
      required: true,
      min: [0, "Credit limit must be a positive number"],
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
