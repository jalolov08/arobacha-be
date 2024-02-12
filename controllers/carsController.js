const Car = require("../models/Car");
const CarBrandModel = require("../models/CarBrandModel");
const arrayUtils = require("../utils/arrayUtils");
const cron = require("node-cron");
const { encryptData } = require("../utils/encryptData");
const { allowedCities } = require("../constants/allowedCities");
function resetViewsToday() {
  cron.schedule("0 0 * * *", async () => {
    try {
      await Car.updateMany({}, { $set: { viewsToday: 0 } });
      console.log("Daily viewsToday reset completed.");
    } catch (error) {
      console.error("Error resetting viewsToday:", error);
    }
  });
}

resetViewsToday();
const encryptionKey = process.env.CRYPTO_SECRET;
async function addNewCar(req, res) {
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
    // doors,
    bodyType,
    customsCleared,
    city,
    photos,
  } = req.body;

  try {
    if (!brand || !model) {
      return res.status(400).json({ error: "Brand and Model are required." });
    }

    const existingBrand = await CarBrandModel.findOne({ brand });

    if (!existingBrand || !existingBrand.models.includes(model)) {
      return res.status(400).json({ error: "Invalid Brand or Model." });
    }
    if (!allowedCities.includes(city)) {
      return res.status(400).json({ error: "Invalid city." });
    }

    if (
      !year ||
      !price ||
      !mileage ||
      !fuelType ||
      !transmission ||
      !condition ||
      !description ||
      !color ||
      // !doors ||
      !bodyType ||
      !customsCleared ||
      !engineCapacity ||
      !city ||
      !photos
    ) {
      return res.status(400).json({ error: "All fields are required." });
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

    const newCar = new Car({
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
      owner: req.user.username,
      color,
      // doors,
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
async function getAllCars(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const skip = (page - 1) * pageSize;

    const allCars = await Car.find().skip(skip).limit(pageSize);
    const shuffledCars = arrayUtils.shuffleArray(allCars);
    const encryptedCars = encryptData(shuffledCars, encryptionKey);
    res.status(200).json({ cars: encryptedCars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getCarById(req, res) {
  const carId = req.params.id;

  try {
    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ error: "Car not found." });
    }

    car.views = (car.views || 0) + 1;
    car.viewsToday = (car.viewsToday || 0) + 1;

    await car.save();
    const encryptedCar = encryptData(car, encryptionKey);
    res.status(200).json({ ad: encryptedCar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function deleteCar(req, res) {
  const { carId } = req.params;

  try {
    const existingCar = await Car.findById(carId);

    if (!existingCar) {
      return res.status(404).json({ error: "Car not found." });
    }
    if (req.user.username !== existingCar.owner.toString()) {
      return res.status(403).json({
        error: "Permission denied. User is not the owner of the car.",
      });
    }

    await Car.deleteOne({ _id: carId });
    res.status(200).json({ message: "Car deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getSimilarCars(req, res) {
  const carId = req.params.id;

  try {
    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ error: "Car not found." });
    }

    const searchParams = {
      brand: car.brand,
      model: car.model,
      city: car.city,
      year: { $gte: car.year - 4, $lte: car.year + 4 },
      price: { $gte: car.price - 15000, $lte: car.price + 15000 },
      _id: { $ne: car._id },
    };

    const similarCars = await Car.find(searchParams).limit(10);

    if (similarCars.length === 0 && car.city) {
      const carsInCity = await Car.find({
        brand: car.brand,
        city: car.city,
        _id: { $ne: car._id },
      }).limit(10);
      const encryptedCarsInCity = encryptData(carsInCity, encryptionKey);
      res.status(200).json({ similarCars: encryptedCarsInCity });
    } else {
      const encryptedSimilarCars = encryptData(similarCars, encryptionKey);
      res.status(200).json({ similarCars: encryptedSimilarCars });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  addNewCar,
  getAllCars,
  getCarById,
  deleteCar,
  getSimilarCars,
};
