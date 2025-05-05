const mongoose = require("mongoose");

const repaymentSchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Repayment must be greater than 0"],
    },
    paidOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Repayment = mongoose.model("Repayment", repaymentSchema);
module.exports = Repayment;
