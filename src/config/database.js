const mongoose = require("mongoose");

const { MONGO_URI } = require("./constants");
const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
};

module.exports = connectDB;
