const express = require("express");
const {
  initiatePayment,
  paymentStatus,
  getTransactionByBooking,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/initiate-payment", initiatePayment);
router.post("/payment-status", paymentStatus);
router.get("/transaction/:bookingId", getTransactionByBooking);

module.exports = router;