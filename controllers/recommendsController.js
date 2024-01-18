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
      recommendation = shuffleArray([...similarCars, ...similarMotorcycles]);
    } else {
      const allCars = await Car.find();
      const allMotorcycles = await Moto.find();
      recommendation = encryptData(
        shuffleArray([...allCars, ...allMotorcycles]),
        encryptionKey
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

module.exports = {
  addToRecommends,
  getRecommends,
};
