const validator = require("validator");

const allowedCustomerFields = [
  "name",
  "phoneNumber",
  "address",
  "trustScore",
  "creditLimit",
];

const validateFields = (data) => {
  const inputFields = Object.keys(data);
  const invalidFields = inputFields.filter(
    (field) => !allowedCustomerFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new Error(`Invalid customer fields: ${invalidFields.join(", ")}`);
  }
};

const validateCreateCustomerData = (data) => {
  validateFields(data);

  const { name, phoneNumber, address, trustScore, creditLimit } = data;

  if (!name || name.length < 3) {
    throw new Error(
      "Customer name is required and must be at least 3 characters"
    );
  }

  if (!phoneNumber || !validator.isMobilePhone(phoneNumber)) {
    throw new Error("A valid phone number is required");
  }

  if (!address || address.length < 5) {
    throw new Error("Address is required and must be at least 5 characters");
  }

  if (!trustScore || trustScore < 0 || trustScore > 10) {
    throw new Error("Trust score is required and must be between 0 and 10");
  }

  if (!creditLimit || creditLimit < 0) {
    throw new Error(
      "Credit limit is required and must be a non-negative number"
    );
  }
};

const validateUpdateCustomerData = (data) => {
  validateFields(data);
  const { name, phoneNumber, address, trustScore, creditLimit } = data;

  if (name && name.length < 3) {
    throw new Error("Customer name must be at least 3 characters");
  }

  if (phoneNumber && !validator.isMobilePhone(phoneNumber)) {
    throw new Error("A valid phone number is required");
  }

  if (address && address.length < 5) {
    throw new Error("Address must be at least 5 characters");
  }

  if (trustScore != null && (trustScore < 0 || trustScore > 10)) {
    throw new Error("Trust score must be between 0 and 10");
  }

  if (creditLimit != null && creditLimit < 0) {
    throw new Error("Credit limit must be a non-negative number");
  }
};

module.exports = {
  validateCreateCustomerData,
  validateUpdateCustomerData,
};
