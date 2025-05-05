const Customer = require("../models/Customer");
const mongoose = require("mongoose");
const errorResponse = require("../utils/errorResponse");

const createCustomer = async (req, res) => {
  try {
    const { name, phoneNumber, address, trustScore, creditLimit } = req.body;
    const userId = req.user._id;

    const customerData = {
      name,
      phoneNumber,
      userId,
      address,
      trustScore,
      creditLimit,
    };

    const customer = new Customer(customerData);
    await customer.save();

    res
      .status(201)
      .json({ message: "Customer data created successfully", customer });
  } catch (error) {
    console.error("Error creating a customer data:", req.user._id, error);
    return errorResponse(res, 500, "CREAT_CUSTOMER_DATA_ERROR", error.message);
  }
};

const getCustomers = async (req, res) => {
  try {
    const userId = req.user._id;
    const customers = await Customer.find({ userId });

    res.status(200).json({ customers });
  } catch (error) {
    console.error("Error fetching customers data:", req.user._id, error);
    return errorResponse(res, 500, "GET_CUSTOMERS_DATA_ERROR", error.message);
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return errorResponse(
        res,
        400,
        "INVALID_CUSTOMER_ID",
        "Invalid customer ID"
      );
    }

    const customer = await Customer.findOne({ _id: customerId, userId });
    if (!customer) {
      return errorResponse(
        res,
        400,
        "CUSTOMER_NOT_FOUND",
        "Customer not found or not owned by user"
      );
    }

    Object.entries(req.body).forEach(([key, value]) => {
      if (value != null) {
        customer[key] = value;
      }
    });

    await customer.save();

    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("Error update customer data:", req.user._id, error);
    return errorResponse(
      res,
      500,
      "UPDATE_CUSTOMERS_DATA_ERROR",
      error.message
    );
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return errorResponse(
        res,
        400,
        "INVALID_CUSTOMER_ID",
        "Invalid customer ID"
      );
    }

    const customer = await Customer.findOneAndDelete({
      _id: customerId,
      userId,
    });

    if (!customer) {
      return errorResponse(
        res,
        400,
        "CUSTOMER_NOT_FOUND",
        "Customer not found or not owned by user"
      );
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error delete customer data:", req.user._id, error);
    return errorResponse(
      res,
      500,
      "DELETE_CUSTOMERS_DATA_ERROR",
      error.message
    );
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
};
