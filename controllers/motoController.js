const Moto = require("../models/Moto");
const MotoBrandModel = require("../models/MotoBrandModel");
const arrayUtils = require("../utils/arrayUtils");
const { encryptData } = require("../utils/encryptData");
const { allowedCities } = require("../constants/allowedCities");

require("dotenv").config();

const encryptionKey = process.env.CRYPTO_SECRET;

async function addNewMoto(req, res) {
  const {
    brand,
    model,
    year,
    price,
    mileage,
    fuelType,
    transmission,
    engineCapacity,
    condition,
    description,
    color,
    wheels,
    bikeType,
    customsCleared,
    city,
    photos,
  } = req.body;
  try {
    if (!brand || !model) {
      return res.status(400).json({ error: "Brand and Model are required." });
    }

    const existingBrand = await MotoBrandModel.findOne({ brand });

    if (!existingBrand || !existingBrand.models.includes(model)) {
      return res.status(400).json({ error: "Invalid Brand or Model." });
    }
    if (!allowedCities.includes(city)) {
      return res.status(400).json({ error: "Invalid city." });
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
    const newMoto = new Moto({
      brand,
      model,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      engineCapacity,
      condition,
      description,
      owner: req.user._id,
      color,
      wheels,
      bikeType,
      customsCleared,
      city,
      photos,
    });
    const savedMoto = await newMoto.save();
    res.status(201).json({ ...savedMoto._doc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function getMoto(req, res) {
  try {
    const allMoto = await Moto.find();
    const shuffledMoto = arrayUtils.shuffleArray(allMoto);
    const encryptedMotos = encryptData(shuffledMoto, encryptionKey);
    res.status(200).json({ cars: encryptedMotos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function getMotoById(req, res) {
  const motoId = req.params.id;
  try {
    const existingMoto = await Moto.findById(motoId);
    if (!existingMoto) {
      return res.status(404).json({ error: "Moto not found." });
    }
    existingMoto.views = (existingMoto.views || 0) + 1;
    existingMoto.viewsToday = (existingMoto.viewsToday || 0) + 1;
    await existingMoto.save();
    const encryptedMoto = encryptData(existingMoto, encryptionKey);
    res.status(200).json({ moto: encryptedMoto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function deleteMoto(req, res) {
  const { motoId } = req.params;
  try {
    const existingMoto = await Moto.findById(motoId);
    if (!existingMoto) {
      return res.status(404).json({ error: "Moto not found" });
    }
    if (req.user._id !== existingMoto.owner.toString()) {
      return res.status(403).json({
        error: "Permission denied.User is not the owner of the moto",
      });
    }
    await Moto.deleteOne({ _id: motoId });
    res.status(200).json({ message: "Moto deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = {
  addNewMoto,
  getMoto,
  getMotoById,
  deleteMoto,
};