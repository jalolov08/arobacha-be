const Moto = require("../models/Moto");
const arrayUtils = require("../utils/arrayUtils");
const { encryptData } = require("../utils/encryptData");
require("dotenv").config
const encryptionKey = process.env.CRYPTO_SECRET;

async function getFilteredMotos(req, res) {
  const {
    brands,
    models,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    minMileage,
    maxMileage,
    city,
    customsCleared,
    bodyType,
    wheels,
    minEngineCapacity,
    maxEngineCapacity,
    transmission,
    fuelType,
    withPhoto,
    condition,
  } = req.query;
  try {
    let query = {};

    if (brands) {
      query.brand = { $in: brands.split(",") };
    }

    if (models) {
      query.model = { $in: models.split(",") };
    }

    if (minPrice > maxPrice) {
      return res
        .status(400)
        .json({ error: "minPrice must be less than or equal to maxPrice." });
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseInt(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = parseInt(maxPrice);
      }
    }

    if (minYear > maxYear || maxYear > new Date().getFullYear()) {
      return res
        .status(400)
        .json({ error: "Invalid minYear or maxYear values." });
    }

    if (minYear || maxYear) {
      query.year = {};
      if (minYear) {
        query.year.$gte = parseInt(minYear);
      }
      if (maxYear) {
        query.year.$lte = parseInt(maxYear);
      }
    }

    if (minMileage || maxMileage) {
      query.mileage = {};
      if (minMileage) {
        query.mileage.$gte = parseInt(minMileage);
      }
      if (maxMileage) {
        query.mileage.$lte = parseInt(maxMileage);
      }
    }

    if (city) {
      query.city = { $in: city.split(",") };
    }

    if (customsCleared !== undefined) {
      query.customsCleared = customsCleared === "true";
    }

    if (bodyType) {
      query.bodyType = { $in: bodyType.split(",") };
    }

    if (wheels) {
      query.doors = parseInt(doors);
    }
    if (condition) {
      query.condition = condition;
    }
    if (minEngineCapacity || maxEngineCapacity) {
      query.engineCapacity = {};
      if (minEngineCapacity) {
        query.engineCapacity.$gte = parseInt(minEngineCapacity);
      }
      if (maxEngineCapacity) {
        query.engineCapacity.$lte = parseInt(maxEngineCapacity);
      }
    }

    if (transmission) {
      query.transmission = transmission;
    }

    if (fuelType) {
      query.fuelType = fuelType;
    }

    if (withPhoto && withPhoto.toLowerCase() === "true") {
      query.photos = { $exists: true, $ne: [] };
    }
    const filteredMotos = await Moto.find(query);
    const shuffledMotos = arrayUtils.shuffleArray(filteredMotos);
    const encryptedMotos = encryptData(shuffledMotos , encryptionKey)
    if (filteredMotos.length === 0) {
      return res
        .status(404)
        .json({ error: "No motos found with the specified criteria." });
    }

    res.status(200).json({ motos: encryptedMotos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = {
  getFilteredMotos,
};
