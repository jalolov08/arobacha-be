const mongoose = require("mongoose");

const carBrandModelSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  logo:{
    type: String,
    required: true,
  },
  models: [{
    type: String,
    required: true,
    trim: true,
  }],
});

const CarBrandModel = mongoose.model("CarBrandModel", carBrandModelSchema);

module.exports = CarBrandModel;
