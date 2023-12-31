const Moto = require("../models/Moto");
const Car = require("../models/Car");
const User = require("../models/User");
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
async function updateMe(req, res) {
  try {
    const userId = req.user._id;
    const { name, surname, username, photoUri, about, calls, chat } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (surname) updateFields.surname = surname;
    if (username) updateFields.username = username;
    if (photoUri) updateFields.photoUri = photoUri;
    if (about) updateFields.about = about;
    if (calls) updateFields.calls = calls;
    if (chat) updateFields.chat = chat;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    if (username) {
      const existingUser = await User.findOne({
        $or: [{ username }],
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Username already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ msg: "Updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getMe,
  getMyAds,
  updateMe,
};
