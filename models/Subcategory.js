const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    subcategory: {
      type: String,
      required: true,
    },
    photoUri: String,
  },

  { timestamps: true }
);

module.exports = mongoose.model("Subcategory", subcategorySchema);
