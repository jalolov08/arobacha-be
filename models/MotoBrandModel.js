const mongoose = require("mongoose");

const motoBrandModelSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  logo: {
    type: String,
    required: true,
  },
  models: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
});
const MotoBrandModel = mongoose.model("MotoBrandModel", motoBrandModelSchema);
module.exports = MotoBrandModel
