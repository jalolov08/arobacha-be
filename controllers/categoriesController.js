const Category = require("../models/Category");
const CryptoJS = require("crypto-js");
require("dotenv").config();

function encryptData(data, key) {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    key
  ).toString();
  return encryptedData;
}

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

      return res.status(201).json({
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

    const encryptionKey = process.env.CRYPTO_SECRET;

    const encryptedCategories = encryptData(categories, encryptionKey);

    res.status(200).json({ categories:encryptedCategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function updateCategory(req, res) {
  const categoryId = req.params.id;
  const { name, photoUri } = req.body;

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (req.user.role === "admin") {
      category.name = name;
      category.photoUri = photoUri;

      await category.save();

      return res.status(200).json({
        message: "Category updated successfully",
        category,
      });
    } else {
      return res
        .status(403)
        .json({ msg: "Нет доступа для обновления категории" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteCategory(req, res) {
  const categoryId = req.params.id;

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (req.user.role === "admin") {
      await category.remove();

      return res.status(200).json({
        message: "Category deleted successfully",
        category,
      });
    } else {
      return res
        .status(403)
        .json({ msg: "Нет доступа для удаления категории" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
