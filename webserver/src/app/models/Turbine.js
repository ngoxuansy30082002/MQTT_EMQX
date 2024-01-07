const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Turbine = new Schema(
  {
    _id: { type: String },
    statusNetwork: {
      type: String,
      enum: ["connected", "disconnected"],
    },
    location: {
      address: { type: String },
      coordinates: { type: [Number] },
    },
    power: { type: Number },
    installed_date: { type: String },
    operatingStatus: {
      type: String,
      enum: ["Active", "Inactive", "Maintenance"],
    },
    maintenanceHistory: [ObjectId],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Turbine", Turbine);
