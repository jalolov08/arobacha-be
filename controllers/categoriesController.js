const Category = require("../models/Category");
const checkAuth = require("../utils/checkAuth");

async function addCategory(req, res) {
  const { name, photoUri } = req.body;

  try {
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res
        .status(400)
        .json({ error: "Category with this name already exists" });
    }

   
    if (req.user.role === "admin") {
      const newCategory = new Category({
        name,
        photoUri,
      });

      await newCategory.save();

      return res
        .status(201)
        .json({
          message: "Category added successfully",
          category: newCategory,
        });
    } else {
     
      return res
        .status(403)
        .json({ msg: "Нет доступа для добавления категории" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await Category.find();

    res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  addCategory,
  getCategories,
};
