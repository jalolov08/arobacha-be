const express = require("express");
const router = express.Router();
const checkAuth = require("../utils/checkAuth");
const fileUpload = require("../utils/fileUpload");
const moto = require("../controllers/motoController");
const motoBrand = require("../controllers/MotoBrandModelController");

router.post("/category/moto/", checkAuth, moto.addNewMoto);
router.get("/category/moto/", moto.getMoto);
router.get("/category/moto/:id", moto.getMotoById);
router.delete("/category/moto/delete/:id", checkAuth, moto.deleteMoto);

router.get("/brabnd/moto", motoBrand.getMotoBrands);
router.get("/brand/moto/:id/models", motoBrand.getMotoBrandModelsById);
router.post("/brand/moto", checkAuth, motoBrand.addMotoBrand);
router.put("/brand/moto", checkAuth, motoBrand.updateMotoBrand);
router.delete("/brand/moto/:brand", checkAuth, motoBrand.deleteMotoBrand);

module.exports = router;