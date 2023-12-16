const Moto = require("../models/Moto");
const Car = require("../models/Car");
const arrayUtils = require("../utils/arrayUtils");
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
async function getMyAdds(req, res) {
  const userId = req.user._id;
  try {
    const cars = await Car.find({ owner: userId }).sort({ createdAt: -1 });
    const motos = await Moto.find({ owner: userId }).sort({ createdAt: -1 });
    const adds = [];

    if (cars.length > 0) {
      adds.push(...cars.map((car) => car.toObject()));
    }

    if (motos.length > 0) {
      adds.push(...motos.map((moto) => moto.toObject()));
    }

    adds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const encryptedAdds = encryptData(adds, encryptionKey);
    res.status(200).json({ adds: encryptedAdds });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getMe,
  getMyAdds,
};
