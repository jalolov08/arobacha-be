const express = require("express");
const router = express.Router();
const checkAuth = require("../utils/checkAuth");
const fileUpload = require("../utils/fileUpload");
const applyWatermark = require("../utils/addWatermark");
const avatarUpload = fileUpload("avatar", ["image/jpeg", "image/png"]);
const brandUpload = fileUpload("brands", ["image/jpeg", "image/png"]);
const carsPhotoUpload = fileUpload("cars", ["image/jpeg", "image/png"]);
const motosPhotoUpload = fileUpload("motos", ["image/jpeg", "image/png"]);
router.post("/upload/car", carsPhotoUpload.array("images"), (req, res) => {
  const filenames = req.files.map((file) => file.filename);

  filenames.forEach((filename) => {
    const inputImagePath = `uploads/cars/${filename}`;
    const outputImagePath = `uploads/cars/w${filename}`;
    const watermarkPath = "assets/logo.png";
    const watermarkSettings = {
      top: 10,
      left: 10,
      blend: "atop",
      width: 50,
      height: 50,
    };

    applyWatermark(
      inputImagePath,
      outputImagePath,
      watermarkPath,
      watermarkSettings
    );
  });

  res.json({
    urls: filenames.map((filename) => `/v1/uploads/cars/w${filename}`),
  });
});

router.post(
  "/upload/moto",
  checkAuth,
  motosPhotoUpload.array("images"),
  (req, res) => {
    const filenames = req.files.map((file) => file.filename);

    res.json({
      urls: filenames.map((filename) => `/v1/uploads/motos/${filename}`),
    });
  }
);

router.post(
  "/upload/avatar",
  checkAuth,
  avatarUpload.single("image"),
  (req, res) => {
    res.json({ url: `/v1//uploads/avatar/${req.file.filename}` });
  }
);
router.post(
  "/upload/brand",
  checkAuth,
  brandUpload.single("image"),
  (req, res) => {
    res.json({ url: `/v1//uploads/brands/${req.file.filename}` });
  }
);

module.exports = router;
