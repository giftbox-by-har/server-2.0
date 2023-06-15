const Product = require("../models/productModel");
const fs = require("fs");

// Controller untuk mendapatkan semua produk
exports.getAllProducts = async (req, res) => {
	const search = req.query.search;
	const boxType = req.query.boxType;
	const products = req.query.products;
	console.log("search:", search);
	console.log("boxType:", boxType);
	console.log("products:", products);

	try {
		let products;

		if (search) {
			products = await Product.find(
				{ $text: { $search: search } },
				{ score: { $meta: "textScore" } }
			).sort({ score: { $meta: "textScore" } });
		} else {
			products = await Product.find().sort({ category: 1 });
		}

		// Cek apakah pengguna telah login
		if (req.user) {
			// Mendapatkan rekomendasi produk
			const recommendations = await getRecommendations(products);

			// Menggabungkan produk dengan rekomendasi
			const result = {
				products,
				recommendations,
			};

			res.json(result);
		} else {
			res.json(products);
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Controller untuk mendapatkan produk berdasarkan ID
exports.getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Produk tidak ditemukan" });
		}
		res.json(product);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Controller untuk membuat produk baru
exports.createProduct = async (req, res) => {
	const product = new Product(req.body);

	if (req.files && req.files.length > 0) {
		product.images = req.files.map((file) => file.path);
	}

	try {
		const newProduct = await product.save();
		res.status(201).json(newProduct);
	} catch (error) {
		// Menghapus file gambar yang diunggah jika terjadi kesalahan dalam pembuatan produk
		if (req.files && req.files.length > 0) {
			req.files.forEach((file) => {
				// Hapus file dari sistem penyimpanan
				fs.unlink(file.path, (err) => {
					if (err) {
						console.error(`Failed to delete file: ${file.path}`);
					}
				});
			});
		}
		console.error(error);
		res.status(400).json({ message: error.message });
	}
};

// Controller untuk memperbarui produk berdasarkan ID
exports.updateProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Produk tidak ditemukan" });
		}
		// Menghapus file gambar yang lama
		if (req.files && req.files.length > 0) {
			// Menghapus file gambar lama dari sistem penyimpanan
			product.images.forEach((imagePath) => {
				fs.unlink(imagePath, (err) => {
					if (err) {
						console.error(`Gagal menghapus file: ${imagePath}`);
					}
				});
			});

			// Memperbarui daftar file gambar baru
			product.images = req.files.map((file) => file.path);
		}

		Object.assign(product, req.body);
		const updatedProduct = await product.save();
		res.json(updatedProduct);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Controller untuk menghapus produk berdasarkan ID
exports.deleteProductById = async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Produk tidak ditemukan" });
		} else {
			// Menghapus file gambar terkait dengan produk
			product.images.forEach((imagePath) => {
				fs.unlink(imagePath, (err) => {
					if (err) {
						console.error(`Gagal menghapus file: ${imagePath}`);
					}
				});
			});
			res.status(200).json({ message: "Produk berhasil dihapus" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
