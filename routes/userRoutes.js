const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// Rute GET '/users'
router.get("/", userController.getUsers);

// Rute GET '/users/:id'
router.get("/:id", userController.getUserById);

// Rute POST '/users'
router.post("/", userController.createUser);

// Rute PUT '/users/:id'
router.put("/:id", userController.updateUser);

// Rute DELETE '/users/:id'
router.delete("/:id", userController.deleteUser);

module.exports = router;
