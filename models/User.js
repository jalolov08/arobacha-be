const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: false,
      default: "",
    },
    about: String,
    photoUri: String,
    calls:{
      type:Boolean,
      required:true,
      default:true
    },
    chat:{
      type:Boolean,
      required:true,
      default:true
    },
    follows: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    favoriteCars: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
      },
    ],
    favoriteMotorcycles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Moto",
      },
    ],
    recommendedCars: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Car",
        },
      ],
      validate: {
        validator: function (array) {
          return array.length <= 15;
        },
        message: "Recommended cars array cannot exceed 15 items.",
      },
    },
    recommendedMotorcycles: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Moto",
        },
      ],
      validate: {
        validator: function (array) {
          return array.length <= 15;
        },
        message: "Recommended motorcycles array cannot exceed 15 items.",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
