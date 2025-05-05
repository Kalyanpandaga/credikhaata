const Loan = require("../models/Loan");
const Repayment = require("../models/Repayment");
const Customer = require("../models/Customer");
const moment = require("moment");
const errorResponse = require("../utils/errorResponse");

const createLoan = async (req, res) => {
  try {
    const {
      customerId,
      itemDescription,
      loanAmount,
      issueDate,
      dueDate,
      frequency,
      interestRate,
      graceDays,
    } = req.body;

    const userId = req.user._id;

    const customer = await Customer.findOne({ _id: customerId, userId });
    if (!customer) {
      return errorResponse(
        res,
        400,
        "CUSTOMER_NOT_FOUND",
        "Customer not found or not owned by user"
      );
    }

    const loan = new Loan({
      userId,
      customerId,
      itemDescription,
      loanAmount,
      remainingAmount: loanAmount,
      issueDate,
      dueDate,
      frequency,
    });

    if (interestRate != null) loan.interestRate = interestRate;
    if (graceDays != null) loan.graceDays = graceDays;

    await loan.save();

    res.status(201).json({ message: "Loan created successfully", loan });
  } catch (error) {
    console.error("Error creating a loan:", req.user._id, error);
    return errorResponse(res, 500, "CREAT_LOAN_ERROR", error.message);
  }
};

const getLoans = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const query = { userId };
    if (status) {
      if (!["PENDING", "OVERDUE", "PAID"].includes(status)) {
        return errorResponse(
          res,
          400,
          "INVALID_STATUS_ENUM",
          `${status} is invalid status. Status must be 'PENDING', 'OVERDUE', or 'PAID'`
        );
      }

      query.status = status;
    }

    const loans = await Loan.find(query)
      .populate("customerId", "name phoneNumber")
      .sort({ dueDate: 1 });

    res.status(200).json({ loans });
  } catch (error) {
    console.error("Error fetching loans:", req.user._id, error);
    errorResponse(res, 500, "GET_LOANS_ERROR", error.message);
  }
};

const getLoanSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const loans = await Loan.find({ userId });

    const totalLoaned = loans.reduce((sum, loan) => sum + loan.loanAmount, 0);
    const totalCollected = loans.reduce(
      (sum, loan) => sum + (loan.loanAmount - loan.remainingAmount),
      0
    );

    const overdueAmount = loans
      .filter((loan) => loan.status === "OVERDUE")
      .reduce((sum, loan) => sum + loan.remainingAmount, 0);

    const repaymentTimes = [];

    const repayments = await Repayment.find({
      loanId: { $in: loans.map((loan) => loan._id) },
    });

    const loanMap = new Map(loans.map((loan) => [loan._id.toString(), loan]));
    for (const r of repayments) {
      const loan = loanMap.get(r.loanId.toString());
      if (loan) {
        const diffDays =
          (new Date(r.paidOn) - new Date(loan.issueDate)) /
          (1000 * 60 * 60 * 24);
        repaymentTimes.push(diffDays);
      }
    }

    const avgRepaymentDays =
      repaymentTimes.length > 0
        ? Number(
            (
              repaymentTimes.reduce((a, b) => a + b, 0) / repaymentTimes.length
            ).toFixed(2)
          )
        : 0;

    return res.status(200).json({
      totalLoaned,
      totalCollected,
      overdueAmount,
      avgRepaymentDays,
    });
  } catch (error) {
    console.error("Error fetching summary:", req.user._id, error);
    return errorResponse(res, 500, "FETCH_SUMMARY_ERROR", error.message);
  }
};

const getOverdueLoans = async (req, res) => {
  try {
    const userId = req.user._id;

    const overdueLoans = await Loan.find({
      userId,
      status: "OVERDUE",
    }).populate("customerId");

    const customerMap = {};

    for (const loan of overdueLoans) {
      const customer = loan.customerId;

      if (!customerMap[customer._id]) {
        customerMap[customer._id] = {
          customerId: customer._id,
          name: customer.name,
          phoneNumber: customer.phoneNumber,
          totalOverdue: 0,
          overdueLoans: [],
        };
      }

      const remaining = loan.remainingAmount;
      const paid = loan.loanAmount - remaining;

      customerMap[customer._id].totalOverdue += remaining;

      customerMap[customer._id].overdueLoans.push({
        loanId: loan._id,
        totalLoan: loan.loanAmount,
        overdueAmount: remaining,
        amountPaid: paid,
        issueDate: loan.issueDate,
        dueDate: loan.dueDate,
        frequency: loan.frequency,
      });
    }

    res.status(200).json({
      overdueLoanCustomers: Object.values(customerMap),
    });
  } catch (error) {
    console.error("Error fetching overdue customers:", req.user._id, error);
    errorResponse(res, 500, "FETCH_OVERDUE_CUSTOMERS_ERROR", error.message);
  }
};

module.exports = { createLoan, getLoans, getLoanSummary, getOverdueLoans };
