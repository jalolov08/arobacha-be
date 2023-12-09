const express = require("express");
const router = express.Router();
const auth = require("./controllers/authController");
const category = require("./controllers/categoriesController");
const subcategory = require("./controllers/subcategoryController");
const checkAuth = require("./utils/checkAuth");
const fileUpload = require("./utils/fileUpload");

const categoryUpload = fileUpload("category", ["image/jpeg", "image/png"]);
const subcategoryUpload = fileUpload("subcategory", ["image/jpeg", "image/png"]);
const avatarUpload = fileUpload("avatar", ["image/jpeg", "image/png"]);
router.post("/v1/auth/register", auth.authUser);
router.post("/v1/auth/login", auth.authLogin);

router
  .route("/v1/category")
  .get(category.getCategories)
  .post(checkAuth, category.addCategory)
  .put(checkAuth, category.updateCategory)
  .delete(checkAuth, category.deleteCategory);

router.post(
  "/v1/upload/category",
  checkAuth,
  categoryUpload.single("image"),
  (req, res) => {
    res.json({ url: `/v1/uploads/category/${req.file.filename}` });
  }
);
router.post(
    "/v1/upload/subcategory",
    checkAuth,
    subcategoryUpload.single("image"),
    (req, res) => {
      res.json({ url: `/v1/uploads/subcategory/${req.file.filename}` });
    }
  );
router.post(
  "/v1/upload/avatar",
  checkAuth,
  avatarUpload.single("image"),
  (req, res) => {
    res.json({ url: `/v1/uploads/avatar/${req.file.filename}` });
  }
);

router
  .route("/v1/category/:id/subcategory")
  .get(subcategory.getSubcategories)
  .post(checkAuth, subcategory.addSubcategory)
  .put(checkAuth, subcategory.updateSubcategory)
  .delete(checkAuth, subcategory.deleteSubcategory);

module.exports = router;
