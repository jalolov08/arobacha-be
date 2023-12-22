const Moto = require("../models/Moto");
const Car = require("../models/Car");
const { encryptData } = require("../utils/encryptData");
require("dotenv").config;

const encryptionKey = process.env.CRYPTO_SECRET;

async function getMe(req, res) {
  const token = req.user;

  try {
    const encryptedUser = encryptData(token, encryptionKey);
    res.status(200).json({ me: encryptedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function getMyAds(req, res) {
  const userId = req.user._id;
  try {
    const cars = await Car.find({ owner: userId }).sort({ createdAt: -1 });
    const motos = await Moto.find({ owner: userId }).sort({ createdAt: -1 });
    const ads = [];

    if (cars.length > 0) {
      ads.push(...cars.map((car) => car.toObject()));
    }

    if (motos.length > 0) {
      ads.push(...motos.map((moto) => moto.toObject()));
    }

    ads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const encryptedAds = encryptData(ads, encryptionKey);
    res.status(200).json({ ads: encryptedAds });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getMe,
  getMyAds,
};
