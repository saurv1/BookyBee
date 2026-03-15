const express = require("express");
const {
  initiatePayment,
  paymentStatus,
  getTransactionByBooking,
  getTransactionsByCustomer,
  getAllTransactions,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/initiate-payment", initiatePayment);
router.post("/payment-status", paymentStatus);
router.get("/transaction/:bookingId", getTransactionByBooking);
router.get("/transactions/customer", getTransactionsByCustomer);
router.get("/transactions/admin", getAllTransactions);

module.exports = router;