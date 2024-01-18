const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken, generateRefreshToken } = require("../utils/tokenUtils");
require("dotenv").config();

const TEST_CODE = 5555;

async function authUser(req, res) {
  try {
    const { name, surname, phone, username, password, photoUri } = req.body;

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

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Пароль должен содержать минимум 8 символов." });
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return res
        .status(400)
        .json({ error: "Недопустимый формат имени пользователя." });
    }

    if (photoUri && !isValidURI(photoUri)) {
      return res.status(400).json({ error: "Неверный формат URI фотографии." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      surname,
      phone,
      username,
      password: hashedPassword,
      photoUri,
    });

    const savedUser = await newUser.save();

    const responseUser = { ...savedUser._doc };
    res.status(201).json(responseUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function verifyUser(req, res) {
  try {
    const { phone, code } = req.body;

    if (code != TEST_CODE) {
      return res.status(400).json({ error: "Invalid verification code." });
    }
    // доп.работа с номером для отправки смс и генерации ОТР

    res.status(200).json({ message: "Verified" });
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

    const token = generateToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies && req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token not found" });
    }

    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const newAccessToken = generateToken(user);

    const newRefreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function isValidURI(uri) {
  try {
    new URL(uri);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  authUser,
  authLogin,
  refreshToken,
  verifyUser
};
