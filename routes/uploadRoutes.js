const express = require("express");
const router = express.Router();
const checkAuth = require("../utils/checkAuth");
const fileUpload = require("../utils/fileUpload");

const avatarUpload = fileUpload("avatar", ["image/jpeg", "image/png"]);
const brandUpload = fileUpload("brands", ["image/jpeg", "image/png"]);
const carsPhotoUpload = fileUpload("cars", ["image/jpeg", "image/png"]);
const motosPhotoUpload = fileUpload("motos", ["image/jpeg", "image/png"]);
router.post(
  "/upload/car",
  checkAuth,
  carsPhotoUpload.array("images"),
  (req, res) => {
    const filenames = req.files.map((file) => file.filename);

    res.json({
      urls: filenames.map((filename) => `/v1/uploads/cars/${filename}`),
    });
  }
);
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
