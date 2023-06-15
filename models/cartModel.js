const mongoose = require("mongoose");
const BoxPackage = require("./boxPackageModel");
const CustomPackage = require("./customPackageModel");

const cartSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				productType: {
					type: String,
					enum: ["BoxPackage", "CustomPackage"],
					required: true,
				},
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					refPath: "products.productType",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					default: 1,
				},
			},
		],
	},
	{ timestamps: true, versionKey: false }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
