const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connect Successfully!!!");
  } catch (error) {
    console.log("MongoDB Connect ERROR!!!", error);
  }
}
module.exports = { connect };
