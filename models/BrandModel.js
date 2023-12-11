const mongoose = require("mongoose");

const brandModelSchema = new mongoose.Schema({
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

const BrandModel = mongoose.model("BrandModel", brandModelSchema);

module.exports = BrandModel;
