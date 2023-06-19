const express = require("express");

const Authentication = require("../middleware/Authentication");
const { processPayment, orderStatus, getOrders, allOrders, getToken } = require("../controller/OrderController");

const router = express.Router()




router.post("/braintree/payment",Authentication, processPayment);
router.get("/braintree/token",Authentication, getToken);
router.get("/getOrders",Authentication, getOrders);
router.get("/allOrders", Authentication, allOrders);
router.post("/orderStatus/:orderId", Authentication, orderStatus);




module.exports = router

