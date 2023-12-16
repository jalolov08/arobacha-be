const express = require("express");
const router = express.Router();
const checkAuth = require("../utils/checkAuth");
const fileUpload = require("../utils/fileUpload");
const car = require("../controllers/carsController");
const carBrand = require("../controllers/CarBrandModelController");
const carFilter = require("../controllers/carFilterController")
router.post("/category/car/", checkAuth, car.addNewCar);
router.get("/category/car/", car.getAllCars);
router.get("/category/car/:id", car.getCarById);
router.delete("/category/car/delete/:carId", checkAuth, car.deleteCar);

router.get("/brand/car", carBrand.getCarBrands);
router.get("/brand/car/:id/models", carBrand.getBrandModelsById);
router.post("/brand/car", checkAuth, carBrand.addBrand);
router.put("/brand/car", checkAuth, carBrand.updateBrand);
router.delete("/brand/car/:brand", checkAuth, carBrand.deleteBrand);

router.get("/category/filter/car" , carFilter.getFilteredCars )


router.get("/category/car/:id/similar" , car.getSimilarCars)
module.exports = router;
