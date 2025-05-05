const { default: mongoose } = require("mongoose");
const Loan = require("../models/Loan");
const Repayment = require("../models/Repayment");
const errorResponse = require("../utils/errorResponse");

const recordRepayment = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return errorResponse(res, 400, "INVALID_LOAN_ID", "Loan ID is invalid");
    }

    const loan = await Loan.findOne({ _id: loanId, userId: req.user._id });

    if (!loan) {
      return errorResponse(
        res,
        400,
        "LOAN_NOT_FOUND",
        "Loan not found or not owned by user"
      );
    }

    if (loan.remainingAmount <= 0) {
      return errorResponse(
        res,
        400,
        "LOAN_ALREADY_REPAID",
        "Loan already fully repaid."
      );
    }

    if (amount > loan.remainingAmount) {
      return errorResponse(
        res,
        400,
        "EXCESS_REPAYMENT",
        `Repayment exceeds remaining amount. Remaining: ${loan.remainingAmount}`
      );
    }

    const repayment = new Repayment({
      loanId,
      amount,
      date: date ? new Date(date) : new Date(),
    });

    await repayment.save();

    loan.remainingAmount -= amount;
    if (loan.remainingAmount === 0) {
      loan.status = "PAID";
    }

    await loan.save();

    res.status(201).json({
      message: "Repayment recorded successfully",
      repayment,
      updatedLoanBalance: loan.remainingAmount,
      loanStatus: loan.status,
    });
  } catch (error) {
    console.error("Error recording repayment:", error);
    errorResponse(res, 500, "REPAYMENT_ERROR", error.message);
  }
};

const getRepaymentsByLoanId = async (req, res) => {
  try {
    const { loanId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return errorResponse(res, 400, "INVALID_LOAN_ID", "Loan ID is invalid");
    }

    const loan = await Loan.findOne({ _id: loanId, userId: req.user._id });

    if (!loan) {
      return errorResponse(
        res,
        400,
        "LOAN_NOT_FOUND",
        "Loan not found or not owned by user"
      );
    }

    const repayments = await Repayment.find({ loanId }).sort({ date: -1 });

    return res.status(200).json({ repayments });
  } catch (error) {
    console.error("Error fetching repayments:", req.user._id, error);
    errorResponse(res, 500, "FETCH_REPAYMENTS_ERROR", error.message);
  }
};

module.exports = {
  recordRepayment,
  getRepaymentsByLoanId,
};
