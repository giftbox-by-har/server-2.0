const express = require('express');
const router = express.Router();
const productController = require("../controllers/productController");
const {productUpload} = require("../middlewares/uploadMiddleware");

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productUpload.array("images"), productController.createProduct);
router.put('/:id', productUpload.array("images"), productController.updateProductById);
router.delete('/:id', productController.deleteProductById);

module.exports = router;
