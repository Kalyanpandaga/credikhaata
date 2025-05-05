const validator = require("validator");
const mongoose = require("mongoose");

const allowedLoanFields = [
  "customerId",
  "itemDescription",
  "loanAmount",
  "interestRate",
  "issueDate",
  "dueDate",
  "frequency",
  "graceDays",
];

const validateFields = (data) => {
  const inputFields = Object.keys(data);
  const invalidFields = inputFields.filter(
    (field) => !allowedLoanFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new Error(`Invalid loan fields: ${invalidFields.join(", ")}`);
  }
};

const validateLoanData = (data) => {
  validateFields(data);

  const {
    customerId,
    itemDescription,
    loanAmount,
    interestRate,
    issueDate,
    dueDate,
    frequency,
    graceDays,
  } = data;

  if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error("Valid customerId is required");
  }

  if (
    !itemDescription ||
    itemDescription.length < 1 ||
    itemDescription.length > 250
  ) {
    throw new Error(
      "itemDescription is required and must be <= 250 characters"
    );
  }

  if (
    loanAmount === undefined ||
    typeof loanAmount !== "number" ||
    loanAmount < 1
  ) {
    throw new Error("loanAmount is required and must be >= 1");
  }

  if (interestRate !== undefined) {
    if (
      typeof interestRate !== "number" ||
      interestRate < 0 ||
      interestRate > 100
    ) {
      throw new Error("interestRate must be between 0 and 100");
    }
  }

  if (!issueDate || !validator.isISO8601(issueDate.toString())) {
    throw new Error("Valid issueDate (YYYY-MM-DD format) is required");
  }

  if (!dueDate || !validator.isISO8601(dueDate.toString())) {
    throw new Error("Valid dueDate (YYYY-MM-DD format) is required");
  }

  if (!["BI-WEEKLY", "MONTHLY"].includes(frequency)) {
    throw new Error("frequency must be one of 'BI-WEEKLY' or 'MONTHLY'");
  }

  if (graceDays !== undefined) {
    if (typeof graceDays !== "number" || graceDays < 0) {
      throw new Error("graceDays must be a non-negative number");
    }
  }
};

module.exports = {
  validateLoanData,
};
