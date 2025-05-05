const mongoose = require("mongoose");
const validator = require("validator");

const allowedRepaymentFields = ["amount", "paidOn"];

const validateFields = (data) => {
  const inputFields = Object.keys(data);
  const invalidFields = inputFields.filter(
    (field) => !allowedRepaymentFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new Error(`Invalid repayment fields: ${invalidFields.join(", ")}`);
  }
};

const validateRepaymentData = (data) => {
  validateFields(data);

  const { amount, paidOn } = data;

  if (amount === undefined || typeof amount !== "number" || amount < 1) {
    throw new Error("amount is required and must be greater than 0");
  }

  if (paidOn !== undefined && !validator.isISO8601(paidOn.toString())) {
    throw new Error("paidOn must be a valid (YYYY-MM-DD format) date");
  }
};

module.exports = {
  validateRepaymentData,
};
