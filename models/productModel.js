const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		productName: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		brand: {
			type: String,
			required: true,
		},
		category: {
			type: [String],
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		dimension: {
			width: {
				type: Number,
				required: true,
			},
			height: {
				type: Number,
				required: true,
			},
			length: {
				type: Number,
				required: true,
			},
			compressionRatio: {
				type: Number,
				required: true,
			},
		},
		images: {
			type: [String],
		},
		variants: {
			type: Boolean,
			default: false,
		},
		variantType: {
			type: [String],
		},
		customize: {
			type: Boolean,
			default: false,
		},
		customizeType: {
			type: [String],
			enum: [
				"TextBox",
				"Images",
				"Multiple TextBox",
				"Multiple Images",
				"CheckBox",
			],
		},
	},
	{ timestamps: true, versionKey: false }
);

productSchema.index({ productName: 'text', description: 'text', brand: 'text', category: 'text', variantsType: 'text' });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
