const express = require("express");
const router = express.Router();
const auth = require("./controllers/authController");
const category = require("./controllers/categoriesController");
const subcategory = require("./controllers/subcategoryController");
const checkAuth = require("./utils/checkAuth");

router.post("/v1/auth/register", auth.authUser);
router.post("/v1/auth/login", auth.authLogin);

router.get("/v1/category", category.getCategories);
router.post("/v1/category", checkAuth, category.addCategory);
router.put("/v1/category/:id", checkAuth, category.updateCategory);
router.delete("/v1/category/:id", checkAuth, category.deleteCategory);

router.get("/v1/category/:id/subcategory", subcategory.getSubcategories);
router.post("/v1/category/:id/subcategory", checkAuth, subcategory.addSubcategory);
router.put("/v1/category/:categoryId/subcategory/:subcategoryId", checkAuth, subcategory.updateSubcategory);
router.delete("/v1/category/:categoryId/subcategory/:subcategoryId", checkAuth, subcategory.deleteSubcategory);
module.exports = router;
