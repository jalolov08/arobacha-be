const mongoose = require("mongoose");

const motorcycleSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
  photos: [
    {
      type: String,
    },
  ],
  fuelType: {
    type: String,
    required: true,
    enum: ["Gasoline", "Electric", "Hybrid", "Other"],
  },
  transmission: {
    type: String,
    enum: ["Automatic", "Manual"],
    required: true,
  },
  engineCapacity: {
    type: Number,
    required: true,
  },
  condition: {
    type: String,
    enum: ["New", "Used"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  wheels: {
    type: Number,
    required: true,
  },
  bikeType: {
    type: String,
    enum: ["Cruiser", "Sportbike", "Touring", "Off-road", "Scooter", "Other"],
    required: true,
  },
  customsCleared: {
    type: Boolean,
    default: false,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  viewsToday: {
    type: Number,
    default: 0,
  },
});

const Moto = mongoose.model("Moto", motorcycleSchema);

module.exports = Moto;
