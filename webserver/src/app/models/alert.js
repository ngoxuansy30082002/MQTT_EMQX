const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Alert = new Schema(
  {
    turbine_id: { type: String },
    engineTemperature: { type: Number },
    pressure: { type: Number },
    wind_speed: { type: Number },
    power_output: { type: Number },
    timestamp: { type: Date },
    description: {type: String}
  }
);
module.exports = mongoose.model("Alert", Alert);
