const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.get("/:Id", orderController.getOrderById);
router.get("/user/:userId", orderController.getOrdersByUserId);
router.put("/:Id", orderController.updateOrder);
router.delete("/:Id", orderController.deleteOrder);

module.exports = router;
