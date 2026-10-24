// routes/paymentRoutes.js

const router = require("express").Router();

const notImplemented = require("../utils/notImplemented");
const { createPayment, getPaymentStatus: getPaymentDetails, refundPayment } = require("../controllers/paymentController");
const verifyPayment = notImplemented("POST /payment/verify");

const { protect, admin } = require("../middlewares/authMiddleware");


// Create payment
router.post(
  "/create",
  protect,
  createPayment
);


// Verify payment
router.post(
  "/verify",
  protect,
  verifyPayment
);


// Get payment details
router.get(
  "/:id",
  protect,
  getPaymentDetails
);


// Refund payment (Admin)
router.put(
  "/refund/:id",
  protect,
  admin,
  refundPayment
);


module.exports = router;