const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function authUser(req, res) {
  try {
    const { name, surname, phone, username, password } = req.body;

    if (!name || !surname || !phone || !username || !password) {
      return res
        .status(400)
        .json({ error: "Все поля обязательны для заполнения." });
    }

    const phoneRegex = /^\+\d{12}$/;
    if (!phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ error: "Неверный формат номера телефона." });
    }

    const existingPhoneUser = await User.findOne({ phone });
    if (existingPhoneUser) {
      return res.status(400).json({
        error: "Пользователь с этим номером телефона уже зарегистрирован.",
      });
    }

    const existingUsernameUser = await User.findOne({ username });
    if (existingUsernameUser) {
      return res.status(400).json({
        error:
          "Имя пользователя уже используется. Пожалуйста, выберите другой.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      surname,
      phone,
      username,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const responseUser = { ...savedUser._doc };
    res.status(201).json(responseUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function authLogin(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Имя пользователя и пароль обязательны." });
    }

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(404).json({ error: "Пользователь не найден." });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Неверный пароль." });
    }

    const token = jwt.sign(
      {
        _id: existingUser._id,
        username: existingUser.username,
        name: existingUser.name,
        phone: existingUser.phone,
        about: existingUser.about,
        photoUri: existingUser.photoUri,
        follows: existingUser.follows,
        followers: existingUser.followers,
        role:existingUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  authUser,
  authLogin,
};
