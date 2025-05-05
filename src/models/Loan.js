const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemDescription: {
      type: String,
      required: true,
      maxLength: 250,
    },
    loanAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    remainingAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    interestRate: {
      type: Number,
      min: 0,
      max: 100,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    frequency: {
      type: String,
      enum: ["BI-WEEKLY", "MONTHLY"],
      required: true,
    },
    graceDays: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "OVERDUE"],
      default: "PENDING",
      required: true,
    },
  },
  { timestamps: true }
);

const Loan = mongoose.model("Loan", loanSchema);
module.exports = Loan;
