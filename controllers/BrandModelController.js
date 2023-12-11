const BrandModel = require("../models/BrandModel");

async function addBrand(req, res) {
  const { brand, models, logo } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Permission denied. User is not an admin." });
    }

    let existingBrand = await BrandModel.findOne({ brand });

    if (existingBrand) {
      const uniqueModels = [...new Set([...existingBrand.models, ...models])];
      existingBrand.models = uniqueModels;
      const updatedBrand = await existingBrand.save();
      res.status(200).json({ ...updatedBrand._doc });
    } else {
      const newBrand = new BrandModel({
        brand,
        models,
        logo,
      });

      const savedBrand = await newBrand.save();
      res.status(201).json({ ...savedBrand._doc });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateBrand(req, res) {
  const { brand, models, logo } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Permission denied. User is not an admin." });
    }

    let existingBrand = await BrandModel.findOne({ brand });

    if (existingBrand) {
      existingBrand.models = [...new Set([...existingBrand.models, ...models])];
      existingBrand.logo = logo || existingBrand.logo; // Update logo if provided
      const updatedBrand = await existingBrand.save();
      res.status(200).json({ ...updatedBrand._doc });
    } else {
      res.status(404).json({ error: "Brand not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteBrand(req, res) {
  const { brand } = req.params;

  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Permission denied. User is not an admin." });
    }

    let existingBrand = await BrandModel.findOne({ brand });

    if (existingBrand) {
      await existingBrand.remove();
      res.status(200).json({ message: "Brand deleted successfully" });
    } else {
      res.status(404).json({ error: "Brand not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  addBrand,
  updateBrand,
  deleteBrand,
};
