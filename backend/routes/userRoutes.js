// routes/userRoutes.js

const router = require("express").Router();

const {
  getProfile: getUserProfile,
  updateProfile: updateUserProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");


// Get user profile
router.get(
  "/profile",
  protect,
  getUserProfile
);


// Update profile
router.put(
  "/update",
  protect,
  upload.single("image"),
  updateUserProfile
);


// Change password
router.put(
  "/change-password",
  protect,
  changePassword
);


// Delete account
router.delete(
  "/delete",
  protect,
  deleteAccount
);


module.exports = router;