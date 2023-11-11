// @Database Mongodb
const mongoose = require("mongoose");

async function connect_db() {
  try {
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: false });
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
}

module.exports = connect_db;
