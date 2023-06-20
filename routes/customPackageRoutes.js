const express = require("express");
const router = express.Router();
const customPackageController = require("../controllers/customPackageController");

router.post("/", customPackageController.createCustomPackage);
router.get("/", customPackageController.getAllCustomPackages);
router.get("/:id", customPackageController.getCustomPackageById);
router.get("/user/:userId", customPackageController.getCustomPackageByUserId);
router.put("/:id", customPackageController.updateCustomPackage);
router.delete("/:id", customPackageController.deleteCustomPackage);

module.exports = router;
