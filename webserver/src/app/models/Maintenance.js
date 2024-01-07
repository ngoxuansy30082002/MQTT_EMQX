const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Maintenance = new Schema({
  type: { type: String },
  responsible: { type: String },
  startDay: { type: String },
  endDay: { type: String },
  description: { type: String },
});
module.exports = mongoose.model("Maintenance", Maintenance);
