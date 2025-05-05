const express = require("express");
const {
  createLoan,
  getLoans,
  getLoanSummary,
  getOverdueLoans,
} = require("../controllers/loanController");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateMiddleware");
const { validateLoanData } = require("../utils/validations/validateLoanData");

const loanRouter = express.Router();
loanRouter.use(authMiddleware);

loanRouter.post("/", validateRequest(validateLoanData), createLoan);
loanRouter.get("/", getLoans);
loanRouter.get("/summary", getLoanSummary);
loanRouter.get("/overdue", getOverdueLoans);

module.exports = loanRouter;
