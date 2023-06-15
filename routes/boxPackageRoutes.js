const express = require('express');
const router = express.Router();
const boxPackageController = require("../controllers/boxPackageController");
const {packageUpload} = require("../middlewares/uploadMiddleware");

router.get('/', boxPackageController.getAllBoxPackages);
router.get('/:id', boxPackageController.getBoxPackageById);
router.post('/', packageUpload.array("images"), boxPackageController.createBoxPackage);
router.put('/:id', packageUpload.array("images"), boxPackageController.updateBoxPackageById);
router.delete('/:id', boxPackageController.deleteBoxPackageById);

module.exports = router;
