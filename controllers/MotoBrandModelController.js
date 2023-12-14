const MotoBrandModel = require("../models/MotoBrandModel");

async function getMotoBrands(req, res) {
  try {
    const allBrands = await MotoBrandModel.find().sort({ brand: "asc" });

    if (allBrands.length === 0) {
      return res.status(404).json({ error: "No brands found" });
    }

    res.status(200).json(allBrands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getMotoBrandModelsById(req, res) {
  const { id } = req.params;

  try {
    const brand = await MotoBrandModel.findById(id);

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    res.status(200).json({ models: brand.models });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addMotoBrand(req, res) {
  const { brand, models, logo } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Permission denied. User is not an admin." });
    }

    let existingBrand = await MotoBrandModel.findOne({ brand });

    if (existingBrand) {
      const uniqueModels = [...new Set([...existingBrand.models, ...models])];
      existingBrand.models = uniqueModels;
      const updatedBrand = await existingBrand.save();
      res.status(200).json({ ...updatedBrand._doc });
    } else {
      const newBrand = new MotoBrandModel({
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

async function updateMotoBrand(req, res) {
  const { brand, models, logo } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Permission denied. User is not an admin." });
    }

    let existingBrand = await MotoBrandModel.findOne({ brand });

    if (existingBrand) {
      existingBrand.models = [...new Set([...existingBrand.models, ...models])];
      existingBrand.logo = logo || existingBrand.logo;
      const updatedBrand = await existingBrand.save();
      res.status(200).json({ ...updatedBrand._doc });
    } else {
      res.status(404).json({ error: "Brand not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteMotoBrand(req, res) {
  const { brand } = req.params;

  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Permission denied. User is not an admin." });
    }

    let existingBrand = await MotoBrandModel.findOne({ brand });

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
  addMotoBrand,
  updateMotoBrand,
  deleteMotoBrand,
  getMotoBrandModelsById,
  getMotoBrands,
};
