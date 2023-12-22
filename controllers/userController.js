const Car = require("../models/Car");
const Moto = require("../models/Moto");
const User = require("../models/User");
const { encryptData } = require("../utils/encryptData");
require("dotenv").config;

const encryptionKey = process.env.CRYPTO_SECRET;

async function followUser(req, res) {
  try {
    const currentUser = await User.findById(req.user._id);

    const userToFollow = await User.findOne({ username: req.params.username });

    if (!userToFollow) {
      return res.status(404).json({ error: "User not found" });
    }

    if (currentUser.follows.includes(userToFollow._id)) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }

    currentUser.follows.push(userToFollow._id);
    await currentUser.save();

    userToFollow.followers.push(currentUser._id);
    await userToFollow.save();

    res.status(200).json({ message: "Following successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function unfollowUser(req, res) {
  try {
    const currentUser = await User.findById(req.user._id);

    const userToUnfollow = await User.findOne({
      username: req.params.username,
    });

    if (!userToUnfollow) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!currentUser.follows.includes(userToUnfollow._id)) {
      return res.status(400).json({ error: "You are not following this user" });
    }

    currentUser.follows = currentUser.follows.filter(
      (userId) => userId.toString() !== userToUnfollow._id.toString()
    );
    await currentUser.save();

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (userId) => userId.toString() !== currentUser._id.toString()
    );
    await userToUnfollow.save();

    res.status(200).json({ message: "Unfollowing successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function getUser(req, res) {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username }).select(
      "name surname username about photoUri follows followers"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const followsCount = user.follows.length;
    const followersCount = user.followers.length;
    const userData = {
      name: user.name,
      surname: user.surname,
      username: user.username,
      about: user.about,
      photoUri: user.photoUri,
      follows: followsCount,
      followers: followersCount,
    };
    const encryptedUser = encryptData(userData, encryptionKey);
    res.json({
      user: encryptedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function getUserAds(req, res) {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username });
    const cars = await Car.find({ owner: user._id }).sort({ createdAt: -1 });
    const motos = await Moto.find({ owner: user._id }).sort({ createdAt: -1 });
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
  followUser,
  unfollowUser,
  getUser,
  getUserAds,
};
