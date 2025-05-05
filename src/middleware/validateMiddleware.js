const errorResponse = require("../utils/errorResponse");

const validateRequest = (validateFn) => {
  return (req, res, next) => {
    try {
      validateFn(req.body);
      next();
    } catch (error) {
      errorResponse(res, 400, "INVALID_INPUT_DATA", error.message);
    }
  };
};

module.exports = validateRequest;
