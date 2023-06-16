const express = require("express");

const Authentication = require("../middleware/Authentication");
const { processPayment, orderStatus, getOrders, allOrders, getToken } = require("../controller/OrderController");

const router = express.Router()

router.post("/braintree/payment", processPayment);
router.get("/braintree/token", getToken);
router.get("/getOrders", getOrders);
router.get("/allOrders", Authentication, allOrders);
router.post("/orderStatus/:orderId", Authentication, orderStatus);




module.exports = router

