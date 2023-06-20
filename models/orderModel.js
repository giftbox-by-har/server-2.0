const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		customPackages: [
			{
				customPackage: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "CustomPackage",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
        status: {
            type: String,
            required: true,
			default: 'menunggu konfirmasi'
        },
	},
	{ timestamps: true, versionKey: false }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
