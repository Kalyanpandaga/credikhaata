const { updateLoanOverdueScheduler } = require("./scheduler");

const startSchedulers = () => {
  updateLoanOverdueScheduler();
};

module.exports = startSchedulers;
