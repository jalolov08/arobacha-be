const Car = require("../models/Car");
const BrandModel = require("../models/BrandModel");

async function addNewCar(req, res) {
  const {
    brand,
    model,
    year,
    price,
    mileage,
    fuelType,
    transmission,
    condition,
    description,
    owner,
    color,
    doors,
    bodyType,
    customsCleared,
    city,
    photos,
  } = req.body;

  try {
    if (!brand || !model) {
      return res.status(400).json({ error: "Brand and Model are required." });
    }

    const existingBrand = await BrandModel.findOne({ brand });

    if (!existingBrand || !existingBrand.models.includes(model)) {
      return res.status(400).json({ error: "Invalid Brand or Model." });
    }

    if (
      !year ||
      !price ||
      !mileage ||
      !fuelType ||
      !transmission ||
      !condition ||
      !owner ||
      !color ||
      !doors ||
      !bodyType ||
      !customsCleared ||
      !city ||
      !photos
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (
      typeof year !== "number" ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      return res.status(400).json({ error: "Invalid year." });
    }

    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({ error: "Invalid price." });
    }

    if (typeof mileage !== "number" || mileage < 0) {
      return res.status(400).json({ error: "Invalid mileage." });
    }

    const newCar = new Car({
      brand,
      model,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      condition,
      description,
      owner,
      color,
      doors,
      bodyType,
      customsCleared,
      city,
      photos,
    });

    const savedCar = await newCar.save();
    res.status(201).json({ ...savedCar._doc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  addNewCar,
};
