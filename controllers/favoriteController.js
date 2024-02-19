const User = require("../models/User");
const Car = require("../models/Car");
const Moto = require("../models/Moto");

async function addToFavorites(req, res) {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { id } = req.body;

    const itemToAdd = (await Car.findById(id)) || (await Moto.findById(id));

    if (!itemToAdd) {
      return res.status(404).json({ msg: "Item not found" });
    }

    const isAlreadyAdded =
      user.favoriteCars.some(
        (favCar) => favCar.item.toString() === id.toString()
      ) ||
      user.favoriteMotorcycles.some(
        (favMoto) => favMoto.item.toString() === id.toString()
      );

    if (isAlreadyAdded) {
      return res.status(400).json({ msg: "Item already in favorites" });
    }
    console.log(itemToAdd._id);
    const newItem = {
      item: itemToAdd._id,
      addedAt: new Date(),
    };

    if (itemToAdd instanceof Car) {
      user.favoriteCars.push(newItem.item); 
    } else if (itemToAdd instanceof Moto) {
      user.favoriteMotorcycles.push(newItem.item); 
    }

    await user.save();

    res.status(200).json({ msg: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function removeFromFavorites(req, res) {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { id } = req.body;

    const isItemInFavorites =
      user.favoriteCars.some(
        (favCar) => favCar.item.toString() === id.toString()
      ) ||
      user.favoriteMotorcycles.some(
        (favMoto) => favMoto.item.toString() === id.toString()
      );

    if (!isItemInFavorites) {
      return res.status(400).json({ msg: "Item not in favorites" });
    }

    if (itemToRemove instanceof Car) {
      user.favoriteCars = user.favoriteCars.filter(
        (favCar) => favCar.item.toString() !== id.toString()
      );
    } else if (itemToRemove instanceof Moto) {
      user.favoriteMotorcycles = user.favoriteMotorcycles.filter(
        (favMoto) => favMoto.item.toString() !== id.toString()
      );
    }

    await user.save();

    res.status(200).json({ msg: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

async function myFavorites(req, res) {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const favoriteCars = await Car.find({ _id: { $in: user.favoriteCars } });
    const favoriteMotorcycles = await Moto.find({
      _id: { $in: user.favoriteMotorcycles },
    });

    const favorites = [...favoriteCars, ...favoriteMotorcycles];
    res.status(200).json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

module.exports = {
  addToFavorites,
  removeFromFavorites,
  myFavorites,
};
