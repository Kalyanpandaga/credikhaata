const validator = require("validator");

const validateSignupData = (userData) => {
  const { firstName, lastName, emailId, password, role } = userData;

  if (!firstName || firstName.length < 3) {
    throw new Error("firstName is required with minumum 3 characters");
  }

  if (!lastName || lastName.length < 3) {
    throw new Error("lastName is required with minumum 3 characters");
  }

  if (!emailId || !validator.isEmail(emailId.toLowerCase().trim())) {
    throw new Error("A valid email is required");
  }

  if (!password || !validator.isStrongPassword(password)) {
    throw new Error(
      "A strong password is required, password contains (min 8 chars, with letters, numbers & symbols)"
    );
  }

  if (role && !["MERCHANT", "ADMIN"].includes(role)) {
    throw new Error("role must be one of 'MERCHANT', 'ADMIN'");
  }
};

const validateLoginData = (userData) => {
  const { emailId, password } = userData;

  if (!emailId || !validator.isEmail(emailId.toLowerCase().trim())) {
    throw new Error("A valid email is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }
};

module.exports = {
  validateSignupData,
  validateLoginData,
};
