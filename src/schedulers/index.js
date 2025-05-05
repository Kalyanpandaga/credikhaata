const {
  updateLoanOverdueScheduler,
  loanReminderScheduler,
} = require("./scheduler");

const startSchedulers = () => {
  updateLoanOverdueScheduler();
  loanReminderScheduler();
};

module.exports = startSchedulers;
