const multer = require("multer");

// Mendefinisikan direktori tujuan penyimpanan file untuk produk
const productStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/product");
	},
	filename: function (req, file, cb) {
		const productName = req.body.productName.replace(/[^\w\s]/gi, '');
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const extension = file.mimetype.split("/")[1];
		const fileName = `${productName}-${uniqueSuffix}.${extension}`;
		cb(null, fileName);
	},
});

// Mendefinisikan direktori tujuan penyimpanan file untuk box
const boxStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/box");
	},
	filename: function (req, file, cb) {
		const boxName = req.body.boxName.replace(/[^\w\s]/gi, '');
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const extension = file.mimetype.split("/")[1];
		const fileName = `${boxName}-${uniqueSuffix}.${extension}`;
		cb(null, fileName);
	},
});

// Mendefinisikan direktori tujuan penyimpanan file untuk package
const packageStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/package");
	},
	filename: function (req, file, cb) {
		const packageName = req.body.packageName.replace(/[^\w\s]/gi, '');
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const extension = file.mimetype.split("/")[1];
		const fileName = `${packageName}-${uniqueSuffix}.${extension}`;
		cb(null, fileName);
	},
});

// Filter untuk jenis file yang diizinkan
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/jpeg" ||
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg"
	) {
		cb(null, true);
	} else {
		cb(new Error("Only JPEG, PNG, and JPG file types are allowed!"), false);
	}
};

// Membuat objek upload multer dengan konfigurasi yang telah diset
const productUpload = multer({
	storage: productStorage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
});
const boxUpload = multer({
	storage: boxStorage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
});
const packageUpload = multer({
	storage: packageStorage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
});

module.exports = { productUpload, boxUpload, packageUpload };
