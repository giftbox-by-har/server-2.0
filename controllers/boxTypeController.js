const BoxType = require("../models/boxTypeModel");
const fs = require("fs");

// Controller untuk mendapatkan semua tipe box
exports.getBoxTypes = async (req, res) => {
	const { search } = req.query;

	try {
		let boxTypes;
		if (search) {
			boxTypes = await BoxType.find(
				{ $text: { $search: search } },
				{ score: { $meta: "textScore" } }
			).sort({ score: { $meta: "textScore" } });
		} else {
			boxTypes = await BoxType.find();
		}
		res.json(boxTypes);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Controller untuk mendapatka tipe box berdasarkan ID
exports.getBoxTypeById = async (req, res) => {
	try {
		const boxType = await BoxType.findById(req.params.id);
		if (!boxType) {
			res.status(404).json({ message: "Tipe box tidak ditemukan" });
		} else {
			res.json(boxType);
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Controller untuk membuat box baru
exports.createBoxType = async (req, res) => {
	const boxType = new BoxType(req.body);

	if (req.files && req.files.length > 0) {
		boxType.images = req.files.map((file) => file.path);
	}

	try {
		const newBoxType = await boxType.save();

		res.status(201).json(newBoxType);
	} catch (error) {
		// Menghapus file yang sudah diunggah jika terjadi kesalahan
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
		res.status(500).json({ message: error.message });
	}
};

// Controller untuk memperbarui tipe box berdasarkan ID
exports.updateBoxTypeById = async (req, res) => {
	try {
		const boxType = await BoxType.findById(req.params.id);
		if (!boxType) {
			return res.status(404).json({ message: "tipe box tidak ditemukan" });
		}
		// Menghapus file gambar yang lama
		if (req.files && req.files.length > 0) {
			// Menghapus file gambar lama dari sistem penyimpanan
			boxType.images.forEach((imagePath) => {
				fs.unlink(imagePath, (err) => {
					if (err) {
						console.error(`Gagal menghapus file: ${imagePath}`);
					}
				});
			});

			// Memperbarui daftar file gambar baru
			boxType.images = req.files.map((file) => file.path);
		}

		Object.assign(boxType, req.body);
		const updatedBoxType = await boxType.save();
		res.json(updatedBoxType);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Menghapus tipe box berdasarkan ID
exports.deleteBoxTypeById = async (req, res) => {
	try {
		const boxType = await BoxType.findByIdAndDelete(req.params.id);
		if (!boxType) {
			res.status(404).json({ message: "Tipe box tidak ditemukan" });
		} else {
			// Menghapus file gambar terkait dengan produk
			boxType.images.forEach((imagePath) => {
				fs.unlink(imagePath, (err) => {
					if (err) {
						console.error(`Gagal menghapus file: ${imagePath}`);
					}
				});
			});
			res.sendStatus(204);
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
