const BoxPackage = require("../models/boxPackageModel");
const fs = require("fs");

// Controller untuk mendapatkan semua paket box
exports.getAllBoxPackages = async (req, res) => {
	const { search } = req.query;

	try {
		let boxPackages;

		if (search) {
			boxPackages = await BoxPackage.find(
				{ $text: { $search: search } },
				{ score: { $meta: "textScore" } }
			).sort({ score: { $meta: "textScore" } });
		} else {
			boxPackages = await BoxPackage.find();
		}
		res.json(boxPackages);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Controller untuk mendapatkan paket boc berdasarkan ID
exports.getBoxPackageById = async (req, res) => {
	try {
		const boxPackage = await BoxPackage.findById(req.params.id);
		if (!boxPackage) {
			return res.status(404).json({ message: "Paket tidak ditemukan" });
		}
		res.json(boxPackage);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Controller untuk membuat produk baru
exports.createBoxPackage = async (req, res) => {
	const boxPackage = new BoxPackage(req.body);

	if (req.files && req.files.length > 0) {
		boxPackage.images = req.files.map((file) => file.path);
	}

	try {
		const newboxPackage = await boxPackage.save();
		res.status(201).json(newboxPackage);
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

// Controller untuk memperbarui tipe box berdasarkan ID
exports.updateBoxPackageById = async (req, res) => {
	try {
		const boxPackage = await BoxPackage.findById(req.params.id);
		if (!boxPackage) {
			return res.status(404).json({ message: "Paket tidak ditemukan" });
		}
		if (req.files && req.files.length > 0) {
			// Menghapus file gambar lama dari sistem penyimpanan
			boxPackage.images.forEach((imagePath) => {
				fs.unlink(imagePath, (err) => {
					if (err) {
						console.error(`Gagal menghapus file: ${imagePath}`);
					}
				});
			});

			// Memperbarui daftar file gambar baru
			boxPackage.images = req.files.map((file) => file.path);
		}

		Object.assign(boxPackage, req.body);
		const updatedBoxPackage = await boxPackage.save();
		res.json(updatedBoxPackage);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Controller untuk menghapus tipe box berdasarkan ID
exports.deleteBoxPackageById = async (req, res) => {
	try {
		const boxPackage = await BoxPackage.findByIdAndDelete(req.params.id);
		if (!boxPackage) {
			return res.status(404).json({ message: "Paket tidak ditemukan" });
		} else {
			// Menghapus file gambar terkait dengan produk
			boxPackage.images.forEach((imagePath) => {
				fs.unlink(imagePath, (err) => {
					if (err) {
						console.error(`Gagal menghapus file: ${imagePath}`);
					}
				});
			});
			res.status(200).json({ message: "Paket berhasil dihapus" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
