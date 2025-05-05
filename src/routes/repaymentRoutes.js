const express = require("express");
const {
  recordRepayment,
  getRepaymentsByLoanId,
} = require("../controllers/repaymentController");
const validateRequest = require("../middleware/validateMiddleware");
const authenticateUser = require("../middleware/authMiddleware");
const {
  validateRepaymentData,
} = require("../utils/validations/validateRepaymentData");

const repaymentRouter = express.Router();

repaymentRouter.use(authenticateUser);

repaymentRouter.post(
  "/:loanId",
  validateRequest(validateRepaymentData),
  recordRepayment
);
repaymentRouter.get("/:loanId", getRepaymentsByLoanId);

module.exports = repaymentRouter;
