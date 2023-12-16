const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
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
    enum: ["Gasoline", "Diesel", "Electric", "Hybrid", "Other"],
  },
  transmission: {
    type: String,
    enum: ["Automatic", "Manual"],
    required: true,
  },
  engineCapacity: {
    type: String,
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
  doors: {
    type: Number,
    required: true,
  },
  bodyType: {
    type: String,
    enum: ["Sedan", "Coupe", "SUV", "Truck", "Van", "Convertible", "Other"],
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

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
