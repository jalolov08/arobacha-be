const express = require("express");
const router = express.Router();
const auth = require("./controllers/authController");
const checkAuth = require("./utils/checkAuth");
const fileUpload = require("./utils/fileUpload");
const car = require("./controllers/carsController");
const brand = require("./controllers/BrandModelController");
const avatarUpload = fileUpload("avatar", ["image/jpeg", "image/png"]);
const brandUpload = fileUpload("brands", ["image/jpeg", "image/png"]);

router.post("/v1/auth/register", auth.authUser);
router.post("/v1/auth/login", auth.authLogin);

router.post(
  "/v1/upload/avatar",
  checkAuth,
  avatarUpload.single("image"),
  (req, res) => {
    res.json({ url: `/v1/uploads/avatar/${req.file.filename}` });
  }
);

router.post("/v1/add/car", checkAuth, car.addNewCar);

router.post("/v1/add/brand", checkAuth, brand.addBrand);
router.put("/v1/update/brand", checkAuth, brand.updateBrand);
router.delete("/v1/delete/brand/:brand", checkAuth, brand.deleteBrand);
router.post(
  "/v1/upload/brand",
  checkAuth,
  brandUpload.single("image"),
  (req, res) => {
    res.json({ url: `/v1/uploads/brands/${req.file.filename}` });
  }
);
module.exports = router;
