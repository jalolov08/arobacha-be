const express = require("express");
const router = express.Router();
const auth = require("./controllers/authController");
const checkAuth = require("./utils/checkAuth");
const fileUpload = require("./utils/fileUpload");
const car = require("./controllers/carsController");
const moto = require("./controllers/motoController");
const carBrand = require("./controllers/CarBrandModelController");
const motoBrand = require("./controllers/MotoBrandModelController");
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

router.post("/v1/category/car/", checkAuth, car.addNewCar);
router.get("/v1/category/car/", car.getAllCars);
router.get("/v1/category/car/:id", car.getCarById);
router.delete("/v1/category/car/delete/:carId", checkAuth, car.deleteCar);

router.post("/v1/category/moto/", checkAuth, moto.addNewMoto);
router.get("/v1/category/moto/", moto.getMoto);
router.get("/v1/category/car/:id", moto.getMotoById);
router.delete("/v1/category/car/delete/:id" ,checkAuth, moto.deleteMoto);

router.get("/v1/brand/car", carBrand.getCarBrands);
router.get("/v1/brand/car/:id/models", carBrand.getBrandModelsById);
router.post("/v1/brand/car", checkAuth, carBrand.addBrand);
router.put("/v1/brand/car", checkAuth, carBrand.updateBrand);
router.delete("/v1/brand/car/:brand", checkAuth, carBrand.deleteBrand);

router.get("/v1/brand/moto", motoBrand.getMotoBrands);
router.get("/v1/brand/moto/:id/models", motoBrand.getMotoBrandModelsById);
router.post("/v1/brand/moto", checkAuth, motoBrand.addMotoBrand);
router.put("/v1/brand/moto", checkAuth, motoBrand.updateMotoBrand);
router.delete("/v1/brand/moto/:brand", checkAuth, motoBrand.deleteMotoBrand);

router.post(
  "/v1/upload/brand",
  checkAuth,
  brandUpload.single("image"),
  (req, res) => {
    res.json({ url: `/v1/uploads/brands/${req.file.filename}` });
  }
);
module.exports = router;
