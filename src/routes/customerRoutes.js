const express = require("express");
const {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const validateRequest = require("../middleware/validateMiddleware");
const {
  validateCreateCustomerData,
  validateUpdateCustomerData,
} = require("../utils/validations/validateCustomerData");
const authMiddleware = require("../middleware/authMiddleware");

const customerRouter = express.Router();

customerRouter.use(authMiddleware);

customerRouter.post(
  "/",
  validateRequest(validateCreateCustomerData),
  createCustomer
);
customerRouter.get("/", getCustomers);
customerRouter.patch(
  "/:customerId",
  validateRequest(validateUpdateCustomerData),
  updateCustomer
);
customerRouter.delete("/:customerId", deleteCustomer);

module.exports = customerRouter;
