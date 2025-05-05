const cron = require("node-cron");
const Loan = require("../models/Loan");
const moment = require("moment");

const updateLoanOverdueScheduler = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("[Loan Overdue Scheduler] Initialized.");
      const utcStartOfToday = moment.utc().startOf("day").toDate();

      const overdueLoans = await Loan.find({
        status: "PENDING",
        dueDate: { $lt: utcStartOfToday },
      });

      if (overdueLoans.length > 0) {
        const bulkOps = overdueLoans.map((loan) => ({
          updateOne: {
            filter: { _id: loan._id },
            update: { status: "OVERDUE" },
          },
        }));

        await Loan.bulkWrite(bulkOps);
        console.log(
          `[Loan Overdue Scheduler] Updated ${bulkOps.length} loans.`
        );
      }
    } catch (err) {
      console.error("Loan Overdue Scheduler Error:", err.message);
    }
  });
};

module.exports = {
  updateLoanOverdueScheduler,
};
