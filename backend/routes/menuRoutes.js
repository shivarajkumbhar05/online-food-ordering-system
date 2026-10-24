// routes/menuRoutes.js

const router = require("express").Router();

const notImplemented = require("../utils/notImplemented");
const { getMenu: getAllMenu, getFoodById: getSingleMenu } = require("../controllers/menuController");
const { addFood: createMenu, deleteFood: deleteMenu } = require("../controllers/adminController");
const updateMenu = notImplemented("PUT /menu/update/:id");

const { protect, admin } = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");


// Create menu item
router.post(
  "/create",
  protect,
  admin,
  upload.single("image"),
  createMenu
);


// Get all menu items
router.get(
  "/",
  getAllMenu
);


// Get single menu item
router.get(
  "/:id",
  getSingleMenu
);


// Update menu item
router.put(
  "/update/:id",
  protect,
  admin,
  upload.single("image"),
  updateMenu
);


// Delete menu item
router.delete(
  "/delete/:id",
  protect,
  admin,
  deleteMenu
);


module.exports = router;