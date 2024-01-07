const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Data = new Schema(
  {
    turbine_id: { type: String },
    engineTemperature: { type: Number },
    pressure: { type: Number },
    wind_speed: { type: Number },
    power_output: { type: Number },
    timestamp: { type: Date },
  },
  {
    timeseries: {
      timeField: "timestamp",
      metaField: "turbine_id",
      bucketMaxSpanSeconds: 86400,
      bucketRoundingSeconds: 86400,
    },
    expireAfterSeconds: 604800,
  }
);
module.exports = mongoose.model("Data", Data);
