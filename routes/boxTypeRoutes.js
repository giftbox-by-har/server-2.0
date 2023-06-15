const express = require("express");
const router = express.Router();
const boxTypeController = require("../controllers/boxTypeController");
const {boxUpload} = require("../middlewares/uploadMiddleware");


router.get("/", boxTypeController.getBoxTypes);
router.get("/:id", boxTypeController.getBoxTypeById);
router.post("/", boxUpload.array("images"), boxTypeController.createBoxType);
router.put("/:id",boxUpload.array("images"),  boxTypeController.updateBoxTypeById);
router.delete("/:id", boxTypeController.deleteBoxTypeById);

module.exports = router;
