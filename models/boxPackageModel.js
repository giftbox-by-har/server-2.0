const mongoose = require("mongoose");

const boxPackageSchema = new mongoose.Schema(
	{
		packageName: {
			type: String,
			required: true,
		},
		description: {
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
	},
	{ timestamps: true, versionKey: false }
);

boxPackageSchema.index({ packageName: 'text', description: 'text', brand: 'text', category: 'text', variantsType: 'text' });


const BoxPackage = mongoose.model("BoxPackage", boxPackageSchema);

module.exports = BoxPackage;
