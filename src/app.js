const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");

const connectDB = require("./config/database");
const { PORT } = require("./config/constants");
const startSchedulers = require("./schedulers");

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRoutes");
const customerRouter = require("./routes/customerRoutes");
const loanRouter = require("./routes/loanRoutes");
const repaymentRouter = require("./routes/repaymentRoutes");

app.use("/api", authRouter);
app.use("/api/customers", customerRouter);
app.use("/api/loans", loanRouter);
app.use("/api/repayments", repaymentRouter);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    startSchedulers();
    app.listen(PORT, () => {
      console.log(`server successfully listen at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
