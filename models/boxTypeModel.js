const mongoose = require("mongoose");

const boxTypeSchema = new mongoose.Schema(
	{
		boxName: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			enum: ["Kotak Kecil", "Kotak Reguler", "Kotak Besar"],
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

boxTypeSchema.index({ boxName: 'text', description: 'text', category: 'text', variantsType: 'text' });

const BoxType = mongoose.model("BoxType", boxTypeSchema);

module.exports = BoxType;
