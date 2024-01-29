const User = require("../models/User");
const Car = require("../models/Car");
const Moto = require("../models/Moto");
const { shuffleArray } = require("../utils/arrayUtils");
const { encryptData } = require("../utils/encryptData");
require("dotenv").config();

const encryptionKey = process.env.CRYPTO_SECRET;

async function addToRecommends(req, res) {
  try {
    const { vehicleId } = req.query;
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const car = await Car.findById(vehicleId);
    if (car) {
      if (!user.recommendedCars.includes(vehicleId)) {
        user.recommendedCars.push(vehicleId);
        await user.save();
        return res
          .status(200)
          .json({ message: "Car added to recommendations successfully" });
      } else {
        return res
          .status(400)
          .json({ error: "Car is already in recommendations" });
      }
    }

    const moto = await Moto.findById(vehicleId);
    if (moto) {
      if (!user.recommendedMotorcycles.includes(vehicleId)) {
        user.recommendedMotorcycles.push(vehicleId);
        await user.save();
        return res.status(200).json({
          message: "Motorcycle added to recommendations successfully",
        });
      } else {
        return res
          .status(400)
          .json({ error: "Motorcycle is already in recommendations" });
      }
    }

    return res.status(400).json({ error: "Invalid vehicle ID" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getRecommends(req, res) {
  try {
    const userId = req.user ? req.user._id : null;
    const user = userId ? await User.findById(userId) : null;

    if (userId && !user) {
      return res.status(404).json({ error: "User not found" });
    }

    let recommendation;
    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;

    if (userId) {
      const recommendedCars = await Car.find({
        _id: { $in: user.recommendedCars },
      });
      const recommendedMotorcycles = await Moto.find({
        _id: { $in: user.recommendedMotorcycles },
      });

      const recommendedCarIds = user.recommendedCars.map((car) =>
        car.toString()
      );
      const recommendedMotoIds = user.recommendedMotorcycles.map((moto) =>
        moto.toString()
      );

      const similarCars = await findSimilarVehicles(
        recommendedCars,
        Car,
        recommendedCarIds
      );
      const similarMotorcycles = await findSimilarVehicles(
        recommendedMotorcycles,
        Moto,
        recommendedMotoIds
      );

      recommendation = shuffleArray([
        ...similarCars,
        ...similarMotorcycles,
      ]).slice((page - 1) * pageSize, page * pageSize);
    } else {
      const allCars = await Car.find();
      const allMotorcycles = await Moto.find();
      recommendation = shuffleArray([...allCars, ...allMotorcycles]).slice(
        (page - 1) * pageSize,
        page * pageSize
      );
    }
    return res.status(200).json(recommendation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function findSimilarVehicles(
  originalVehicles,
  Model,
  userRecommendedIds
) {
  if (originalVehicles.length === 0) {
    return Model.find();
  }

  const criteria = {
    $and: [
      {
        $or: originalVehicles.map(
          (vehicle) => ({ brand: vehicle.brand }, { model: vehicle.model })
        ),
      },
      { _id: { $nin: userRecommendedIds } },
    ],
  };

  return Model.find(criteria);
}
async function getAdById(req, res) {
  const adId = req.params.id;
  try {
    const ad = await findAdById(adId);
    if (!ad) {
      return res.status(404).json({ error: "Ad not found." });
    }
    ad.views = (ad.views || 0) + 1;
    ad.viewsToday = (ad.viewsToday || 0) + 1;
    await ad.save();
    const encryptedAd = encryptData(ad , encryptionKey)
    res.status(200).json({ ad:encryptedAd });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function findAdById(adId) {
  const moto = await Moto.findById(adId);
  if (moto) return moto;
  return await Car.findById(adId);
}

module.exports = {
  addToRecommends,
  getRecommends,
  getAdById
};
