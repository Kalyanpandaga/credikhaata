const cron = require("node-cron");
const Loan = require("../models/Loan");
const moment = require("moment");
const { sendSMS } = require("../services/smsService");

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

const loanReminderScheduler = () => {
  cron.schedule("0 12 * * *", async () => {
    try {
      console.log("[Loan Reminder Scheduler] Running at 10:00 AM...");

      const today = moment.utc().startOf("day");
      const tomorrow = moment.utc().add(1, "day").startOf("day");

      const dueLoans = await Loan.find({
        status: "PENDING",
        dueDate: {
          $gte: today.toDate(),
          $lte: tomorrow.endOf("day").toDate(),
        },
      })
        .populate("customerId", "name phoneNumber")
        .populate("userId", "firstName lastName");

      for (const loan of dueLoans) {
        const customer = loan.customerId;
        const merchant = loan.userId;

        if (!customer?.phoneNumber || !merchant) continue;

        const dueDateStr = moment(loan.dueDate).format("MMM Do");
        const msg = `Hi ${customer.name}, reminder from ${merchant.firstName} ${merchant.lastName}: Your loan of ₹${loan.loanAmount} is due on ${dueDateStr}. Remaining balance: ₹${loan.remainingAmount}. - CrediKhata`;

        await sendSMS(customer.phoneNumber, msg);
      }

      console.log(
        `[Loan Reminder Scheduler] Sent reminders for ${dueLoans.length} loans.`
      );
    } catch (err) {
      console.error("[Loan Reminder Scheduler] Error:", err.message);
    }
  });
};

module.exports = {
  updateLoanOverdueScheduler,
  loanReminderScheduler,
};
