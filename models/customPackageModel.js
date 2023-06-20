const mongoose = require("mongoose");

const customPackageSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		boxType: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "BoxType",
			required: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
				selectedVariant: {
					type: String,
				},
				customText: {
					type: String,
				},
				customImages: {
					type: String,
				},
			},
		],
	},
	{ timestamps: true, versionKey: false }
);

const CustomPackage = mongoose.model("CustomPackage", customPackageSchema);

module.exports = CustomPackage;
