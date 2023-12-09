const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const CryptoJS = require("crypto-js");
require("dotenv").config();

function encryptData(data, key) {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    key
  ).toString();
  return encryptedData;
}

async function getSubcategories(req, res) {
  const categoryId = req.params.id;
  const encryptionKey = process.env.CRYPTO_SECRET;
  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const encryptedSubcategories = encryptData(
      category.subcategories,
      encryptionKey
    );
    res.status(200).json({ subcategories: encryptedSubcategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function addSubcategory(req, res) {
  const categoryId = req.params.id;
  const { subcategory , photoUri} = req.body;

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (req.user.role === "admin") {
      category.subcategories.push({ subcategory });
      await category.save();

      return res.status(201).json({
        message: "Subcategory added to the category successfully",
        category,
        photoUri
      });
    } else {
      return res
        .status(403)
        .json({ msg: "Нет доступа для добавления подкатегории" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function updateSubcategory(req, res) {
  const categoryId = req.params.categoryId;
  const subcategoryId = req.params.subcategoryId;
  const { subcategory , photoUri } = req.body;

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const subcategoryToUpdate = category.subcategories.id(subcategoryId);

    if (!subcategoryToUpdate) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    if (req.user.role === "admin") {
      subcategoryToUpdate.subcategory = subcategory;
      await category.save();

      return res.status(200).json({
        message: "Subcategory updated successfully",
        category,
        photoUri
      });
    } else {
      return res
        .status(403)
        .json({ msg: "Нет доступа для обновления подкатегории" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function deleteSubcategory(req, res) {
  const categoryId = req.params.categoryId;
  const subcategoryId = req.params.subcategoryId;

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const subcategoryToDelete = category.subcategories.id(subcategoryId);

    if (!subcategoryToDelete) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    if (req.user.role === "admin") {
      subcategoryToDelete.remove();
      await category.save();

      return res.status(200).json({
        message: "Subcategory deleted successfully",
        category,
      });
    } else {
      return res
        .status(403)
        .json({ msg: "Нет доступа для удаления подкатегории" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getSubcategories,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
