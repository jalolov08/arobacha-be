const mongoose = require("mongoose");
const Subcategory = require("./Subcategory");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photoUri: {
      type: String,
      required: false,
    },
    subcategories: [Subcategory.schema],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Category", categorySchema);
